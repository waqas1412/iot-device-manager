/**
 * Analytics Service Server
 */

import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { Logger, APP_CONSTANTS } from '@iot-dm/shared';

import { connectRedis, disconnectRedis } from './config/redis.js';
import { AnalyticsService } from './services/analytics.service.js';
import { AnalyticsController } from './controllers/analytics.controller.js';
import { createAnalyticsRoutes } from './routes/analytics.routes.js';

dotenv.config();

const logger = new Logger('AnalyticsService');

function createApp(): Application {
  const app = express();

  app.use(cors({ origin: '*' }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Dependency injection
  const analyticsService = new AnalyticsService();
  const analyticsController = new AnalyticsController(analyticsService);

  // Routes
  app.use('/analytics', createAnalyticsRoutes(analyticsController));

  // Health check
  app.get('/health', (_req, res) => {
    res.json({
      status: 'healthy',
      service: 'analytics-service',
      timestamp: new Date().toISOString(),
    });
  });

  return app;
}

async function startServer(): Promise<void> {
  try {
    await connectRedis();

    const app = createApp();
    const port = process.env.ANALYTICS_SERVICE_PORT || APP_CONSTANTS.PORTS.ANALYTICS_SERVICE;

    const server = app.listen(port, () => {
      logger.info(`Analytics Service running on port ${port}`);
    });

    // Set server timeout
    server.timeout = 30000; // 30 seconds

    const shutdown = async (): Promise<void> => {
      logger.info('Shutting down gracefully...');
      server.close(async () => {
        await disconnectRedis();
        logger.info('Server closed');
        process.exit(0);
      });

      setTimeout(() => {
        logger.error('Forced shutdown');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error('Failed to start server', error as Error);
    process.exit(1);
  }
}

startServer();


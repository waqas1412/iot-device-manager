/**
 * Device Service Server
 * Demonstrates: Service initialization, dependency injection, clean startup
 */

import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { Logger, APP_CONSTANTS } from '@iot-dm/shared';

import { connectDatabase, disconnectDatabase } from './config/database.js';
import { DeviceRepository } from './repositories/device.repository.js';
import { DeviceService } from './services/device.service.js';
import { DeviceController } from './controllers/device.controller.js';
import { createDeviceRoutes } from './routes/device.routes.js';

dotenv.config();

const logger = new Logger('DeviceService');

/**
 * Create and configure Express application
 * Demonstrates: Dependency injection, composition root pattern
 */
function createApp(): Application {
  const app = express();

  // Middleware
  app.use(cors({ origin: '*' }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Dependency injection
  const deviceRepository = new DeviceRepository();
  const deviceService = new DeviceService(deviceRepository);
  const deviceController = new DeviceController(deviceService);

  // Routes
  app.use('/devices', createDeviceRoutes(deviceController));

  // Health check
  app.get('/health', (_req, res) => {
    res.json({
      status: 'healthy',
      service: 'device-service',
      timestamp: new Date().toISOString(),
    });
  });

  return app;
}

/**
 * Start the server
 * Single Responsibility: Server lifecycle management
 */
async function startServer(): Promise<void> {
  try {
    // Connect to database
    await connectDatabase();

    const app = createApp();
    const port = process.env.DEVICE_SERVICE_PORT || APP_CONSTANTS.PORTS.DEVICE_SERVICE;

    const server = app.listen(port, () => {
      logger.info(`Device Service running on port ${port}`);
    });

    // Graceful shutdown
    const shutdown = async (): Promise<void> => {
      logger.info('Shutting down gracefully...');

      server.close(async () => {
        await disconnectDatabase();
        logger.info('Server closed');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
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

// Start the server
startServer();


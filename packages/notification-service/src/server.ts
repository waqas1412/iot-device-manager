/**
 * Notification Service Server
 * Demonstrates: WebSocket integration, real-time communication, event-driven architecture
 */

import express, { Application } from 'express';
import { createServer, Server } from 'http';
import dotenv from 'dotenv';

import { Logger, APP_CONSTANTS, ApiResponseUtil } from '@iot-dm/shared';

import { WebSocketManager } from './websocket/websocket-manager.js';
import { PubSubService } from './services/pubsub.service.js';

dotenv.config();

const logger = new Logger('NotificationService');

let wsManager: WebSocketManager;
let pubSubService: PubSubService;

/**
 * Create Express application with WebSocket support
 */
function createApp(): { app: Application; server: Server } {
  const app = express();
  const server = createServer(app);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize WebSocket
  wsManager = new WebSocketManager();
  wsManager.initialize(server);

  // Health check
  app.get('/health', (_req, res) => {
    res.json({
      status: 'healthy',
      service: 'notification-service',
      timestamp: new Date().toISOString(),
      websocket: wsManager.getStats(),
    });
  });

  // API endpoint to send notifications
  app.post('/notifications/send', async (req, res) => {
    try {
      const { type, message, data } = req.body;

      await pubSubService.publishNotification({ type, message, data });

      res.json(ApiResponseUtil.success({ message: 'Notification sent' }));
    } catch (error) {
      res.status(500).json(ApiResponseUtil.error({
        code: 'INTERNAL_ERROR',
        message: 'Failed to send notification',
      }));
    }
  });

  // API endpoint to publish device events
  app.post('/events/device', async (req, res) => {
    try {
      const { type, deviceId, data } = req.body;

      await pubSubService.publishDeviceEvent({ type, deviceId, data });

      res.json(ApiResponseUtil.success({ message: 'Event published' }));
    } catch (error) {
      res.status(500).json(ApiResponseUtil.error({
        code: 'INTERNAL_ERROR',
        message: 'Failed to publish event',
      }));
    }
  });

  return { app, server };
}

/**
 * Start the server
 */
async function startServer(): Promise<void> {
  try {
    const { server } = createApp();

    // Initialize Pub/Sub after WebSocket
    pubSubService = new PubSubService(wsManager);
    await pubSubService.initialize();

    const port = process.env.NOTIFICATION_SERVICE_PORT || APP_CONSTANTS.PORTS.NOTIFICATION_SERVICE;

    server.listen(port, () => {
      logger.info(`Notification Service running on port ${port}`);
    });

    const shutdown = async (): Promise<void> => {
      logger.info('Shutting down gracefully...');

      wsManager.close();
      await pubSubService.close();

      server.close(() => {
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


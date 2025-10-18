/**
 * User Service Server
 */

import express, { Application } from 'express';
import dotenv from 'dotenv';

import { Logger, APP_CONSTANTS } from '@iot-dm/shared';

import { connectDatabase, disconnectDatabase } from './config/database.js';
import { UserRepository } from './repositories/user.repository.js';
import { AuthService } from './services/auth.service.js';
import { AuthController } from './controllers/auth.controller.js';
import { createAuthRoutes } from './routes/auth.routes.js';

dotenv.config();

const logger = new Logger('UserService');

/**
 * Create and configure Express application
 */
function createApp(): Application {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Dependency injection
  const userRepository = new UserRepository();
  const authService = new AuthService(userRepository);
  const authController = new AuthController(authService);

  // Routes
  app.use('/auth', createAuthRoutes(authController));

  // Health check
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      service: 'user-service',
      timestamp: new Date().toISOString(),
    });
  });

  return app;
}

/**
 * Start the server
 */
async function startServer(): Promise<void> {
  try {
    await connectDatabase();

    const app = createApp();
    const port = process.env.USER_SERVICE_PORT || APP_CONSTANTS.PORTS.USER_SERVICE;

    const server = app.listen(port, () => {
      logger.info(`User Service running on port ${port}`);
    });

    const shutdown = async (): Promise<void> => {
      logger.info('Shutting down gracefully...');
      server.close(async () => {
        await disconnectDatabase();
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


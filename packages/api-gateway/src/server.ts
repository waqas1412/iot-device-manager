/**
 * API Gateway Server
 * Demonstrates: Express setup, middleware composition, clean architecture
 */

import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import { Logger } from '@iot-dm/shared';

import { config } from './config/index.js';
import { swaggerSpec } from './config/swagger.js';
import { errorHandler, notFoundHandler, rateLimiter, requestLogger } from './middleware/index.js';
import routes from './routes/index.js';

const logger = new Logger('APIGateway');

/**
 * Create and configure Express application
 * Single Responsibility: Application setup and configuration
 */
function createApp(): Application {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
    })
  );

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Custom middleware
  app.use(requestLogger);
  app.use(rateLimiter);

  // Swagger API Documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'IoT Device Manager API',
  }));

  // Swagger JSON
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Routes
  app.use(routes);

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

/**
 * Start the server
 * Single Responsibility: Server lifecycle management
 */
function startServer(): void {
  const app = createApp();

  const server = app.listen(config.port, () => {
    logger.info(`API Gateway running on port ${config.port}`, {
      env: config.env,
      port: config.port,
    });
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  });
}

// Start the server
startServer();


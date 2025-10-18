/**
 * Request logging middleware
 * Demonstrates: Observability, debugging support
 */

import { Request, Response, NextFunction } from 'express';

import { Logger } from '@iot-dm/shared';

const logger = new Logger('HTTP');

/**
 * Log HTTP requests
 * Single Responsibility: Log incoming requests and responses
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  // Log request
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path} - ${res.statusCode}`, {
      duration: `${duration}ms`,
    });
  });

  next();
}


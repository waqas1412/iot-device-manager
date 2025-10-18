/**
 * Error handling middleware
 * Demonstrates: Centralized error handling, proper HTTP responses
 */

import { Request, Response, NextFunction } from 'express';

import { AppError, ApiResponseUtil, Logger } from '@iot-dm/shared';

const logger = new Logger('ErrorHandler');

/**
 * Global error handling middleware
 * Single Responsibility: Handle all application errors
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error('Error occurred', error, {
    path: req.path,
    method: req.method,
  });

  // Handle known application errors
  if (error instanceof AppError) {
    res.status(error.statusCode).json(
      ApiResponseUtil.error({
        code: error.errorCode,
        message: error.message,
        details: error.details,
      })
    );
    return;
  }

  // Handle unknown errors
  res.status(500).json(
    ApiResponseUtil.error({
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    })
  );
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json(
    ApiResponseUtil.error({
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    })
  );
}


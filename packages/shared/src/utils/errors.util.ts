/**
 * Custom error classes
 * Demonstrates: Error handling, inheritance, type safety
 */

import { ErrorCode, HttpStatus } from '../types/index.js';

/**
 * Base application error
 * Open/Closed Principle: Open for extension, closed for modification
 */
export abstract class AppError extends Error {
  public readonly statusCode: HttpStatus;
  public readonly errorCode: ErrorCode;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    statusCode: HttpStatus,
    errorCode: ErrorCode,
    isOperational = true,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

/**
 * Validation error
 * Liskov Substitution: Can be used wherever AppError is expected
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR, true, details);
  }
}

/**
 * Authentication error
 */
export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, HttpStatus.UNAUTHORIZED, ErrorCode.AUTHENTICATION_ERROR);
  }
}

/**
 * Authorization error
 */
export class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, HttpStatus.FORBIDDEN, ErrorCode.AUTHORIZATION_ERROR);
  }
}

/**
 * Not found error
 */
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND);
  }
}

/**
 * Conflict error
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT, ErrorCode.CONFLICT);
  }
}

/**
 * Internal server error
 */
export class InternalError extends AppError {
  constructor(message = 'Internal server error', details?: Record<string, unknown>) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_ERROR, false, details);
  }
}


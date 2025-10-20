/**
 * Authentication middleware for API Gateway
 * Demonstrates: JWT validation, request authorization
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { AuthenticationError, UserRole } from '@iot-dm/shared';

/**
 * Extend Express Request to include user
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

/**
 * Authenticate JWT token
 * Single Responsibility: Validate and decode JWT tokens
 */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-min-32-characters-long-please-change-in-production';
    
    const payload = jwt.verify(token, jwtSecret) as any;

    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role as UserRole,
    };

    // Set user ID header for downstream services
    req.headers['x-user-id'] = payload.userId;

    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      next(error);
    } else {
      next(new AuthenticationError('Invalid token'));
    }
  }
}

/**
 * Optional authentication middleware for demo purposes
 * Allows requests without authentication but sets a default user ID
 */
export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-min-32-characters-long-please-change-in-production';
      
      try {
        const payload = jwt.verify(token, jwtSecret) as any;
        req.user = {
          userId: payload.userId,
          email: payload.email,
          role: payload.role as UserRole,
        };
        req.headers['x-user-id'] = payload.userId;
      } catch (jwtError) {
        // If token is invalid, continue without authentication
        req.headers['x-user-id'] = 'demo-user-id';
      }
    } else {
      // For demo purposes, set a default user ID (admin user from seeded data)
      req.headers['x-user-id'] = '68f6508fa4c571173d7e7e2d';
    }

    next();
  } catch (error) {
    // For demo purposes, continue with default user ID (admin user from seeded data)
    req.headers['x-user-id'] = '68f6508fa4c571173d7e7e2d';
    next();
  }
}

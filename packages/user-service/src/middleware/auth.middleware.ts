/**
 * Authentication middleware
 * Demonstrates: JWT validation, request authorization
 */

import { Request, Response, NextFunction } from 'express';

import { AuthenticationError, AuthorizationError, UserRole } from '@iot-dm/shared';

import { verifyAccessToken } from '../config/jwt.util.js';

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
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role as UserRole,
    };

    // Set user ID header for downstream services
    res.setHeader('x-user-id', payload.userId);

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
 * Authorize based on user roles
 * Demonstrates: Role-based access control (RBAC)
 */
export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AuthenticationError('Not authenticated'));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new AuthorizationError('Insufficient permissions'));
      return;
    }

    next();
  };
}


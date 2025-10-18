/**
 * Authentication routes
 */

import { Router } from 'express';

import { AuthController } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

/**
 * Create authentication routes
 */
export function createAuthRoutes(authController: AuthController): Router {
  const router = Router();

  // Public routes
  router.post('/register', authController.register);
  router.post('/login', authController.login);

  // Protected routes
  router.get('/profile', authenticate, authController.getProfile);

  return router;
}


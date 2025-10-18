/**
 * Authentication Controller
 * Demonstrates: Controller pattern, request handling
 */

import { Request, Response, NextFunction } from 'express';

import { ApiResponseUtil } from '@iot-dm/shared';

import { IAuthService } from '../services/auth.service.js';

/**
 * Authentication Controller
 */
export class AuthController {
  constructor(private authService: IAuthService) {}

  /**
   * Register new user
   */
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user, tokens } = await this.authService.register(req.body);

      res.status(201).json(
        ApiResponseUtil.success({
          user,
          tokens,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Login user
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user, tokens } = await this.authService.login(req.body);

      res.json(
        ApiResponseUtil.success({
          user,
          tokens,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get current user profile
   */
  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(ApiResponseUtil.success(req.user));
    } catch (error) {
      next(error);
    }
  };
}


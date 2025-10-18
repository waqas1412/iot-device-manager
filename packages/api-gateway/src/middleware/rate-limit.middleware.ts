/**
 * Rate limiting middleware
 * Demonstrates: Security best practices, DoS protection
 */

import rateLimit from 'express-rate-limit';

import { ApiResponseUtil } from '@iot-dm/shared';

import { config } from '../config/index.js';

/**
 * Create rate limiter
 * Single Responsibility: Prevent abuse through rate limiting
 */
export const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: ApiResponseUtil.error({
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests from this IP, please try again later',
  }),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json(
      ApiResponseUtil.error({
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests from this IP, please try again later',
      })
    );
  },
});


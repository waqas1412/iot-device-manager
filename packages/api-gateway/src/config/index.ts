/**
 * API Gateway configuration
 * Demonstrates: Configuration management, environment variables
 */

import dotenv from 'dotenv';

import { APP_CONSTANTS } from '@iot-dm/shared';

dotenv.config();

export const config = {
  port: process.env.API_GATEWAY_PORT || APP_CONSTANTS.PORTS.API_GATEWAY,
  env: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4200',

  services: {
    device: `http://localhost:${APP_CONSTANTS.PORTS.DEVICE_SERVICE}`,
    analytics: `http://localhost:${APP_CONSTANTS.PORTS.ANALYTICS_SERVICE}`,
    notification: `http://localhost:${APP_CONSTANTS.PORTS.NOTIFICATION_SERVICE}`,
    user: `http://localhost:${APP_CONSTANTS.PORTS.USER_SERVICE}`,
  },

  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || APP_CONSTANTS.RATE_LIMIT.WINDOW_MS,
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || APP_CONSTANTS.RATE_LIMIT.MAX_REQUESTS,
  },
} as const;


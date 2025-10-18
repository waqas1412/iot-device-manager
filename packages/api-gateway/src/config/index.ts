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
    device: process.env.DEVICE_SERVICE_URL || `http://device-service:${APP_CONSTANTS.PORTS.DEVICE_SERVICE}`,
    analytics: process.env.ANALYTICS_SERVICE_URL || `http://analytics-service:${APP_CONSTANTS.PORTS.ANALYTICS_SERVICE}`,
    notification: process.env.NOTIFICATION_SERVICE_URL || `http://notification-service:${APP_CONSTANTS.PORTS.NOTIFICATION_SERVICE}`,
    user: process.env.USER_SERVICE_URL || `http://user-service:${APP_CONSTANTS.PORTS.USER_SERVICE}`,
  },

  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || APP_CONSTANTS.RATE_LIMIT.WINDOW_MS,
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || APP_CONSTANTS.RATE_LIMIT.MAX_REQUESTS,
  },
} as const;


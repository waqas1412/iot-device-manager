/**
 * API Gateway routes
 * Demonstrates: Service routing, proxy pattern
 */

import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { ApiResponseUtil } from '@iot-dm/shared';

import { config } from '../config/index.js';

const router = Router();

/**
 * Health check endpoint
 * Single Responsibility: Report service health
 */
router.get('/health', (_req, res) => {
  res.json(
    ApiResponseUtil.success({
      status: 'healthy',
      service: 'api-gateway',
      timestamp: new Date().toISOString(),
    })
  );
});

/**
 * Proxy to Device Service
 * Demonstrates: Microservices communication
 */
router.use(
  '/devices',
  createProxyMiddleware({
    target: config.services.device,
    changeOrigin: true,
  })
);

/**
 * Proxy to Analytics Service
 */
router.use(
  '/analytics',
  createProxyMiddleware({
    target: config.services.analytics,
    changeOrigin: true,
  })
);

/**
 * Proxy to Notification Service
 */
router.use(
  '/notifications',
  createProxyMiddleware({
    target: config.services.notification,
    changeOrigin: true,
  })
);

/**
 * Proxy to User Service - Users
 */
router.use(
  '/users',
  createProxyMiddleware({
    target: config.services.user,
    changeOrigin: true,
  })
);

/**
 * Proxy to User Service - Auth
 */
router.use(
  '/auth',
  createProxyMiddleware({
    target: config.services.user,
    changeOrigin: true,
  })
);

export default router;


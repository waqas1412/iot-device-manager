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
router.get('/health', (req, res) => {
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
  '/api/devices',
  createProxyMiddleware({
    target: config.services.device,
    changeOrigin: true,
    pathRewrite: {
      '^/api/devices': '/devices',
    },
  })
);

/**
 * Proxy to Analytics Service
 */
router.use(
  '/api/analytics',
  createProxyMiddleware({
    target: config.services.analytics,
    changeOrigin: true,
    pathRewrite: {
      '^/api/analytics': '/analytics',
    },
  })
);

/**
 * Proxy to Notification Service
 */
router.use(
  '/api/notifications',
  createProxyMiddleware({
    target: config.services.notification,
    changeOrigin: true,
    pathRewrite: {
      '^/api/notifications': '/notifications',
    },
  })
);

/**
 * Proxy to User Service
 */
router.use(
  '/api/users',
  createProxyMiddleware({
    target: config.services.user,
    changeOrigin: true,
    pathRewrite: {
      '^/api/users': '/users',
    },
  })
);

router.use(
  '/api/auth',
  createProxyMiddleware({
    target: config.services.user,
    changeOrigin: true,
    pathRewrite: {
      '^/api/auth': '/auth',
    },
  })
);

export default router;


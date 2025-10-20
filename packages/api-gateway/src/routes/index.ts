/**
 * API Gateway routes
 * Demonstrates: Service routing, proxy pattern
 */

import { Router, Request } from 'express';
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
 * Proxy middleware with dynamic routing
 * Routes requests to appropriate microservice based on path
 */
router.use(
  createProxyMiddleware({
    target: config.services.device, // Default target
    changeOrigin: true,
    timeout: 15000, // 15 second timeout
    proxyTimeout: 15000,
    router: (req: Request) => {
      // Route to appropriate service based on path
      if (req.path.startsWith('/devices')) {
        return config.services.device;
      }
      if (req.path.startsWith('/analytics')) {
        return config.services.analytics;
      }
      if (req.path.startsWith('/notifications')) {
        return config.services.notification;
      }
      if (req.path.startsWith('/users') || req.path.startsWith('/auth')) {
        return config.services.user;
      }
      // Default to device service
      return config.services.device;
    },
    on: {
      error: (err: Error, req: Request, res: any) => {
        console.error('Proxy error:', err.message, 'for', req.path);
        if (!res.headersSent) {
          res.status(502).json({
            success: false,
            error: {
              code: 'PROXY_ERROR',
              message: 'Service temporarily unavailable',
            },
          });
        }
      },
      proxyReq: (proxyReq: any, req: Request) => {
        // Ensure x-user-id header is forwarded for GET requests
        if (req.headers['x-user-id']) {
          proxyReq.setHeader('x-user-id', req.headers['x-user-id']);
        }
      },
    },
  })
);

export default router;


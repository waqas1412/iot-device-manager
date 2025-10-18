/**
 * Analytics routes
 */

import { Router } from 'express';

import { AnalyticsController } from '../controllers/analytics.controller.js';

export function createAnalyticsRoutes(analyticsController: AnalyticsController): Router {
  const router = Router();

  router.post('/devices/:deviceId/metrics', analyticsController.storeMetrics);
  router.get('/devices/:deviceId/metrics', analyticsController.getMetrics);
  router.get('/devices/:deviceId/metrics/history', analyticsController.getMetricsHistory);
  router.get('/devices/:deviceId/stats', analyticsController.getStats);

  return router;
}


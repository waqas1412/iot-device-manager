/**
 * Analytics Controller
 */

import { Request, Response, NextFunction } from 'express';

import { ApiResponseUtil } from '@iot-dm/shared';

import { AnalyticsService } from '../services/analytics.service.js';

export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  /**
   * Store device metrics
   */
  storeMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { deviceId } = req.params;
      const metrics = req.body;

      await this.analyticsService.storeMetrics(deviceId, metrics);

      res.status(201).json(ApiResponseUtil.success({ message: 'Metrics stored successfully' }));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get device metrics
   */
  getMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { deviceId } = req.params;
      const metrics = await this.analyticsService.getDeviceMetrics(deviceId);

      res.json(ApiResponseUtil.success(metrics));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get device metrics history
   */
  getMetricsHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { deviceId } = req.params;
      const limit = req.query.limit ? Number(req.query.limit) : 10;

      const history = await this.analyticsService.getDeviceMetricsHistory(deviceId, limit);

      res.json(ApiResponseUtil.success(history));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get aggregated statistics
   */
  getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { deviceId } = req.params;
      const stats = await this.analyticsService.getAggregatedStats(deviceId);

      res.json(ApiResponseUtil.success(stats));
    } catch (error) {
      next(error);
    }
  };
}


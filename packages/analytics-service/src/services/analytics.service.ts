/**
 * Analytics Service
 * Demonstrates: Redis caching, data aggregation, performance optimization
 */

import { Logger, APP_CONSTANTS, IDeviceMetrics } from '@iot-dm/shared';

import { getRedisClient } from '../config/redis.js';

/**
 * Analytics Service
 * Single Responsibility: Handle device metrics and analytics
 */
export class AnalyticsService {
  private logger = new Logger('AnalyticsService');

  /**
   * Store device metrics
   * Demonstrates: Redis caching with TTL
   */
  async storeMetrics(deviceId: string, metrics: Record<string, unknown>): Promise<void> {
    const redis = getRedisClient();

    const key = `device:metrics:${deviceId}`;
    const data: IDeviceMetrics = {
      deviceId,
      timestamp: new Date(),
      metrics: metrics as Record<string, number | string | boolean>,
    };

    // Store in Redis with TTL
    await redis.setEx(key, APP_CONSTANTS.CACHE_TTL.DEVICE_METRICS, JSON.stringify(data));

    // Add to time-series list
    await redis.lPush(`device:metrics:history:${deviceId}`, JSON.stringify(data));
    await redis.lTrim(`device:metrics:history:${deviceId}`, 0, 99); // Keep last 100 entries

    this.logger.info('Metrics stored', { deviceId });
  }

  /**
   * Get current device metrics
   * Demonstrates: Cache retrieval
   */
  async getDeviceMetrics(deviceId: string): Promise<IDeviceMetrics | null> {
    const redis = getRedisClient();
    const key = `device:metrics:${deviceId}`;

    const data = await redis.get(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data) as IDeviceMetrics;
  }

  /**
   * Get device metrics history
   * Demonstrates: Time-series data retrieval
   */
  async getDeviceMetricsHistory(deviceId: string, limit = 10): Promise<IDeviceMetrics[]> {
    const redis = getRedisClient();
    const key = `device:metrics:history:${deviceId}`;

    const data = await redis.lRange(key, 0, limit - 1);

    return data.map((item) => JSON.parse(item) as IDeviceMetrics);
  }

  /**
   * Get aggregated statistics
   * Demonstrates: Data aggregation
   */
  async getAggregatedStats(deviceId: string): Promise<{
    count: number;
    latest: IDeviceMetrics | null;
    history: IDeviceMetrics[];
  }> {
    const redis = getRedisClient();
    const historyKey = `device:metrics:history:${deviceId}`;

    const count = await redis.lLen(historyKey);
    const latest = await this.getDeviceMetrics(deviceId);
    const history = await this.getDeviceMetricsHistory(deviceId, 5);

    return {
      count,
      latest,
      history,
    };
  }

  /**
   * Clear device metrics
   */
  async clearDeviceMetrics(deviceId: string): Promise<void> {
    const redis = getRedisClient();

    await redis.del(`device:metrics:${deviceId}`);
    await redis.del(`device:metrics:history:${deviceId}`);

    this.logger.info('Metrics cleared', { deviceId });
  }
}


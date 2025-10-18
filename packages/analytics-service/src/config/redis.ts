/**
 * Redis connection configuration
 * Demonstrates: Redis client setup, caching layer
 */

import { createClient } from 'redis';

import { APP_CONSTANTS, Logger } from '@iot-dm/shared';

const logger = new Logger('Redis');

let redisClient: ReturnType<typeof createClient> | null = null;

/**
 * Connect to Redis
 * Single Responsibility: Manage Redis connection lifecycle
 */
export async function connectRedis(): Promise<ReturnType<typeof createClient>> {
  try {
    const client = createClient({
      url: APP_CONSTANTS.DATABASE.REDIS_URI,
    });

    client.on('error', (error) => {
      logger.error('Redis connection error', error);
    });

    client.on('connect', () => {
      logger.info('Connected to Redis');
    });

    client.on('reconnecting', () => {
      logger.warn('Reconnecting to Redis');
    });

    await client.connect();

    redisClient = client;
    return client;
  } catch (error) {
    logger.error('Failed to connect to Redis', error as Error);
    throw error;
  }
}

/**
 * Get Redis client
 */
export function getRedisClient(): ReturnType<typeof createClient> {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
}

/**
 * Disconnect from Redis
 */
export async function disconnectRedis(): Promise<void> {
  try {
    if (redisClient) {
      await redisClient.quit();
      logger.info('Disconnected from Redis');
    }
  } catch (error) {
    logger.error('Error disconnecting from Redis', error as Error);
    throw error;
  }
}


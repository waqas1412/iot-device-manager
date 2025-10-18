/**
 * Shared constants
 * Demonstrates: DRY principle, centralized configuration
 */

export const APP_CONSTANTS = {
  // Service ports
  PORTS: {
    API_GATEWAY: 3000,
    DEVICE_SERVICE: 3001,
    ANALYTICS_SERVICE: 3002,
    NOTIFICATION_SERVICE: 3003,
    USER_SERVICE: 3004,
  },

  // JWT configuration
  JWT: {
    ACCESS_TOKEN_EXPIRY: '15m',
    REFRESH_TOKEN_EXPIRY: '7d',
    ALGORITHM: 'HS256' as const,
  },

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },

  // Rate limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
  },

  // Cache TTL (in seconds)
  CACHE_TTL: {
    DEVICE_STATUS: 60,
    DEVICE_METRICS: 300,
    USER_SESSION: 3600,
  },

  // Database
  DATABASE: {
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/iot-device-manager',
    REDIS_URI: process.env.REDIS_URI || 'redis://localhost:6379',
  },

  // WebSocket events
  WS_EVENTS: {
    DEVICE_STATUS_CHANGED: 'device:status:changed',
    DEVICE_METRICS_UPDATED: 'device:metrics:updated',
    NOTIFICATION_SENT: 'notification:sent',
  },

  // Redis channels
  REDIS_CHANNELS: {
    DEVICE_EVENTS: 'device:events',
    NOTIFICATIONS: 'notifications',
  },
} as const;

export const VALIDATION_RULES = {
  EMAIL: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 255,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },
  DEVICE_NAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100,
  },
} as const;


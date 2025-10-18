/**
 * Redis Pub/Sub Service
 * Demonstrates: Pub/Sub pattern, event-driven architecture, microservices communication
 */

import { createClient } from 'redis';

import { APP_CONSTANTS, Logger } from '@iot-dm/shared';

import { WebSocketManager } from '../websocket/websocket-manager.js';

/**
 * PubSub Service
 * Single Responsibility: Handle Redis pub/sub for inter-service communication
 */
export class PubSubService {
  private publisher: ReturnType<typeof createClient> | null = null;
  private subscriber: ReturnType<typeof createClient> | null = null;
  private logger = new Logger('PubSubService');

  constructor(private wsManager: WebSocketManager) {}

  /**
   * Initialize Redis pub/sub clients
   */
  async initialize(): Promise<void> {
    try {
      // Create publisher client
      this.publisher = createClient({ url: APP_CONSTANTS.DATABASE.REDIS_URI });
      await this.publisher.connect();
      this.logger.info('Redis publisher connected');

      // Create subscriber client
      this.subscriber = createClient({ url: APP_CONSTANTS.DATABASE.REDIS_URI });
      await this.subscriber.connect();
      this.logger.info('Redis subscriber connected');

      // Subscribe to channels
      await this.subscribeToChannels();
    } catch (error) {
      this.logger.error('Failed to initialize pub/sub', error as Error);
      throw error;
    }
  }

  /**
   * Subscribe to Redis channels
   * Demonstrates: Event subscription, message handling
   */
  private async subscribeToChannels(): Promise<void> {
    if (!this.subscriber) return;

    // Subscribe to device events
    await this.subscriber.subscribe(APP_CONSTANTS.REDIS_CHANNELS.DEVICE_EVENTS, (message) => {
      this.handleDeviceEvent(message);
    });

    // Subscribe to notifications
    await this.subscriber.subscribe(APP_CONSTANTS.REDIS_CHANNELS.NOTIFICATIONS, (message) => {
      this.handleNotification(message);
    });

    this.logger.info('Subscribed to Redis channels');
  }

  /**
   * Handle device events
   * Demonstrates: Event processing, broadcasting to WebSocket clients
   */
  private handleDeviceEvent(message: string): void {
    try {
      const event = JSON.parse(message);
      this.logger.info('Device event received', { type: event.type, deviceId: event.deviceId });

      // Broadcast to WebSocket clients
      this.wsManager.broadcast({
        type: APP_CONSTANTS.WS_EVENTS.DEVICE_STATUS_CHANGED,
        data: event,
      });
    } catch (error) {
      this.logger.error('Error handling device event', error as Error);
    }
  }

  /**
   * Handle notifications
   */
  private handleNotification(message: string): void {
    try {
      const notification = JSON.parse(message);
      this.logger.info('Notification received', { type: notification.type });

      // Broadcast to WebSocket clients
      this.wsManager.broadcast({
        type: APP_CONSTANTS.WS_EVENTS.NOTIFICATION_SENT,
        data: notification,
      });
    } catch (error) {
      this.logger.error('Error handling notification', error as Error);
    }
  }

  /**
   * Publish device event
   * Demonstrates: Event publishing for other services
   */
  async publishDeviceEvent(event: {
    type: string;
    deviceId: string;
    data: unknown;
  }): Promise<void> {
    if (!this.publisher) {
      throw new Error('Publisher not initialized');
    }

    await this.publisher.publish(
      APP_CONSTANTS.REDIS_CHANNELS.DEVICE_EVENTS,
      JSON.stringify(event)
    );

    this.logger.info('Device event published', { type: event.type, deviceId: event.deviceId });
  }

  /**
   * Publish notification
   */
  async publishNotification(notification: { type: string; message: string; data?: unknown }): Promise<void> {
    if (!this.publisher) {
      throw new Error('Publisher not initialized');
    }

    await this.publisher.publish(
      APP_CONSTANTS.REDIS_CHANNELS.NOTIFICATIONS,
      JSON.stringify(notification)
    );

    this.logger.info('Notification published', { type: notification.type });
  }

  /**
   * Close pub/sub connections
   */
  async close(): Promise<void> {
    if (this.subscriber) {
      await this.subscriber.quit();
    }
    if (this.publisher) {
      await this.publisher.quit();
    }
    this.logger.info('Pub/Sub connections closed');
  }
}


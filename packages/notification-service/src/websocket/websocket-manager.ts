/**
 * WebSocket Manager
 * Demonstrates: Real-time communication, Observer pattern, connection management
 */

import { WebSocket, WebSocketServer } from 'ws';
import { Server } from 'http';

import { Logger } from '@iot-dm/shared';

/**
 * WebSocket Manager
 * Single Responsibility: Manage WebSocket connections and broadcasting
 * Observer Pattern: Clients subscribe to events
 */
export class WebSocketManager {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, WebSocket> = new Map();
  private logger = new Logger('WebSocketManager');

  /**
   * Initialize WebSocket server
   */
  initialize(server: Server): void {
    this.wss = new WebSocketServer({ server });

    this.wss.on('connection', (ws: WebSocket, _req) => {
      const clientId = this.generateClientId();
      this.clients.set(clientId, ws);

      this.logger.info('Client connected', { clientId, totalClients: this.clients.size });

      ws.on('message', (message: Buffer) => {
        this.handleMessage(clientId, message.toString());
      });

      ws.on('close', () => {
        this.clients.delete(clientId);
        this.logger.info('Client disconnected', { clientId, totalClients: this.clients.size });
      });

      ws.on('error', (error) => {
        this.logger.error('WebSocket error', error, { clientId });
      });

      // Send welcome message
      this.sendToClient(clientId, {
        type: 'connection',
        data: { clientId, message: 'Connected to notification service' },
      });
    });

    this.logger.info('WebSocket server initialized');
  }

  /**
   * Send message to specific client
   */
  sendToClient(clientId: string, data: unknown): void {
    const client = this.clients.get(clientId);

    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  }

  /**
   * Broadcast message to all clients
   * Demonstrates: Observer pattern - notify all observers
   */
  broadcast(data: unknown): void {
    const message = JSON.stringify(data);

    this.clients.forEach((client, _clientId) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

    this.logger.info('Message broadcasted', { recipients: this.clients.size });
  }

  /**
   * Broadcast to specific users (room-based broadcasting)
   */
  broadcastToRoom(room: string, data: unknown): void {
    // In a real implementation, clients would subscribe to rooms
    // For simplicity, we broadcast to all
    this.broadcast({ room, ...(data as object) });
  }

  /**
   * Handle incoming messages from clients
   */
  private handleMessage(clientId: string, message: string): void {
    try {
      const data = JSON.parse(message);
      this.logger.info('Message received', { clientId, type: data.type });

      // Handle different message types
      switch (data.type) {
        case 'ping':
          this.sendToClient(clientId, { type: 'pong', timestamp: Date.now() });
          break;
        case 'subscribe':
          // Handle room subscription
          this.logger.info('Client subscribed', { clientId, room: data.room });
          break;
        default:
          this.logger.warn('Unknown message type', { type: data.type });
      }
    } catch (error) {
      this.logger.error('Error handling message', error as Error, { clientId });
    }
  }

  /**
   * Generate unique client ID
   */
  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  /**
   * Get connection statistics
   */
  getStats(): { totalClients: number } {
    return {
      totalClients: this.clients.size,
    };
  }

  /**
   * Close all connections
   */
  close(): void {
    this.clients.forEach((client) => {
      client.close();
    });
    this.clients.clear();
    this.wss?.close();
    this.logger.info('WebSocket server closed');
  }
}


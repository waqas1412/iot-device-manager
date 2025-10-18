/**
 * WebSocket Service
 * Demonstrates: Real-time communication, Observable pattern, event handling
 */

import { Injectable, signal } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface WebSocketMessage {
  type: string;
  data: unknown;
}

/**
 * WebSocket Service
 * Single Responsibility: Manage WebSocket connection and messages
 */
@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private ws: WebSocket | null = null;
  private messageSubject = new Subject<WebSocketMessage>();

  // Signal for connection status
  connected = signal<boolean>(false);

  /**
   * Connect to WebSocket server
   */
  connect(): void {
    if (this.ws) {
      return;
    }

    this.ws = new WebSocket(environment.wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.connected.set(true);
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.messageSubject.next(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.connected.set(false);
      this.ws = null;

      // Reconnect after 5 seconds
      setTimeout(() => this.connect(), 5000);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.connected.set(false);
    }
  }

  /**
   * Send message to server
   */
  send(message: unknown): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  /**
   * Get message observable
   */
  getMessages(): Observable<WebSocketMessage> {
    return this.messageSubject.asObservable();
  }

  /**
   * Subscribe to specific message type
   */
  onMessage(type: string): Observable<WebSocketMessage> {
    return new Observable((observer) => {
      const subscription = this.messageSubject.subscribe((message) => {
        if (message.type === type) {
          observer.next(message);
        }
      });

      return () => subscription.unsubscribe();
    });
  }
}


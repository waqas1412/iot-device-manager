/**
 * Dashboard Component
 * Demonstrates: Standalone components, Signals, reactive UI
 */

import { Component, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DeviceService } from '../devices/services/device.service';
import { WebSocketService } from '../../core/services/websocket.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <header class="dashboard-header">
        <h1>IoT Device Manager</h1>
        <div class="user-info">
          @if (auth.currentUser(); as user) {
            <span>{{ user.username }}</span>
            <button (click)="logout()" class="btn-logout">Logout</button>
          }
        </div>
      </header>

      <div class="dashboard-stats">
        <div class="stat-card">
          <h3>Total Devices</h3>
          <p class="stat-value">{{ deviceService.devices().length }}</p>
        </div>
        <div class="stat-card">
          <h3>Online Devices</h3>
          <p class="stat-value">{{ onlineDevices() }}</p>
        </div>
        <div class="stat-card">
          <h3>Offline Devices</h3>
          <p class="stat-value">{{ offlineDevices() }}</p>
        </div>
        <div class="stat-card">
          <h3>WebSocket Status</h3>
          <p class="stat-value" [class.connected]="ws.connected()">
            {{ ws.connected() ? 'Connected' : 'Disconnected' }}
          </p>
        </div>
      </div>

      <div class="device-list">
        <div class="list-header">
          <h2>Devices</h2>
          <button (click)="refreshDevices()" class="btn-refresh" [disabled]="deviceService.loading()">
            {{ deviceService.loading() ? 'Loading...' : 'Refresh' }}
          </button>
        </div>

        @if (deviceService.loading()) {
          <p class="loading">Loading devices...</p>
        } @else if (deviceService.devices().length === 0) {
          <p class="empty">No devices found. Create your first device!</p>
        } @else {
          <div class="devices-grid">
            @for (device of deviceService.devices(); track device.id) {
              <div class="device-card" [class]="'status-' + device.status">
                <div class="device-header">
                  <h3>{{ device.name }}</h3>
                  <span class="device-status">{{ device.status }}</span>
                </div>
                <div class="device-info">
                  <p><strong>Type:</strong> {{ device.type }}</p>
                  <p><strong>ID:</strong> {{ device.id }}</p>
                  @if (device.metadata?.manufacturer) {
                    <p><strong>Manufacturer:</strong> {{ device.metadata.manufacturer }}</p>
                  }
                  @if (device.lastSeenAt) {
                    <p><strong>Last Seen:</strong> {{ formatDate(device.lastSeenAt) }}</p>
                  }
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e0e0e0;
    }

    .dashboard-header h1 {
      margin: 0;
      color: #2c3e50;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .btn-logout {
      padding: 8px 16px;
      background: #e74c3c;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .btn-logout:hover {
      background: #c0392b;
    }

    .dashboard-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .stat-card h3 {
      margin: 0 0 10px 0;
      color: #7f8c8d;
      font-size: 14px;
      text-transform: uppercase;
    }

    .stat-value {
      margin: 0;
      font-size: 32px;
      font-weight: bold;
      color: #2c3e50;
    }

    .stat-value.connected {
      color: #27ae60;
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .list-header h2 {
      margin: 0;
      color: #2c3e50;
    }

    .btn-refresh {
      padding: 10px 20px;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .btn-refresh:hover:not(:disabled) {
      background: #2980b9;
    }

    .btn-refresh:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .devices-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .device-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border-left: 4px solid #95a5a6;
    }

    .device-card.status-online {
      border-left-color: #27ae60;
    }

    .device-card.status-offline {
      border-left-color: #e74c3c;
    }

    .device-card.status-error {
      border-left-color: #e67e22;
    }

    .device-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .device-header h3 {
      margin: 0;
      color: #2c3e50;
    }

    .device-status {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
      background: #ecf0f1;
      color: #7f8c8d;
    }

    .device-info p {
      margin: 8px 0;
      color: #7f8c8d;
      font-size: 14px;
    }

    .loading, .empty {
      text-align: center;
      padding: 40px;
      color: #7f8c8d;
    }
  `]
})
export class DashboardComponent implements OnInit {
  deviceService = inject(DeviceService);
  ws = inject(WebSocketService);
  auth = inject(AuthService);

  constructor() {
    // Effect to log device changes
    effect(() => {
      console.log('Devices updated:', this.deviceService.devices().length);
    });
  }

  ngOnInit() {
    this.refreshDevices();
    this.ws.connect();

    // Subscribe to WebSocket messages
    this.ws.onMessage('device:status:changed').subscribe((message) => {
      console.log('Device status changed:', message);
      this.refreshDevices();
    });
  }

  refreshDevices() {
    this.deviceService.loadDevices().subscribe({
      error: (err) => console.error('Error loading devices:', err)
    });
  }

  onlineDevices(): number {
    return this.deviceService.devices().filter(d => d.status === 'online').length;
  }

  offlineDevices(): number {
    return this.deviceService.devices().filter(d => d.status === 'offline').length;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }

  logout() {
    this.auth.logout();
  }
}


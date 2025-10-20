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
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, CardComponent, BadgeComponent],
  template: `
    <div class="dashboard">
      <!-- Header Section -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-left">
            <div class="logo">
              <div class="logo-icon">⚡</div>
              <h1 class="gradient-text">IoT Nexus</h1>
            </div>
            <p class="header-subtitle">Device Management Dashboard</p>
          </div>
          <div class="header-right">
            @if (auth.currentUser(); as user) {
              <div class="user-profile">
                <div class="user-avatar">
                  <span>{{ user.username.charAt(0).toUpperCase() }}</span>
                </div>
                <div class="user-details">
                  <span class="username">{{ user.username }}</span>
                  <span class="user-role">Administrator</span>
                </div>
                <app-button 
                  variant="outline" 
                  size="sm" 
                  (onClick)="logout()"
                  class="logout-btn"
                >
                  Logout
                </app-button>
              </div>
            }
          </div>
        </div>
      </header>

      <!-- Stats Grid -->
      <div class="dashboard-stats">
        <app-card class="stat-card" [glow]="true" [floating]="true">
          <div class="stat-content">
            <div class="stat-icon">📱</div>
            <div class="stat-info">
              <h3>Total Devices</h3>
              <p class="stat-value">{{ deviceService.devices().length }}</p>
            </div>
          </div>
        </app-card>

        <app-card class="stat-card" [glow]="true" [floating]="true">
          <div class="stat-content">
            <div class="stat-icon online">🟢</div>
            <div class="stat-info">
              <h3>Online Devices</h3>
              <p class="stat-value online">{{ onlineDevices() }}</p>
            </div>
          </div>
        </app-card>

        <app-card class="stat-card" [glow]="true" [floating]="true">
          <div class="stat-content">
            <div class="stat-icon offline">🔴</div>
            <div class="stat-info">
              <h3>Offline Devices</h3>
              <p class="stat-value offline">{{ offlineDevices() }}</p>
            </div>
          </div>
        </app-card>

        <app-card class="stat-card" [glow]="true" [floating]="true">
          <div class="stat-content">
            <div class="stat-icon" [class.connected]="ws.connected()">
              {{ ws.connected() ? '🔗' : '🔌' }}
            </div>
            <div class="stat-info">
              <h3>Connection Status</h3>
              <p class="stat-value" [class.connected]="ws.connected()">
                {{ ws.connected() ? 'Connected' : 'Disconnected' }}
              </p>
            </div>
          </div>
        </app-card>
      </div>

      <!-- Device List Section -->
      <div class="device-section">
        <div class="section-header">
          <div class="section-title">
            <h2>Device Network</h2>
            <p class="section-subtitle">Monitor and manage your IoT ecosystem</p>
          </div>
          <app-button 
            variant="default" 
            size="default"
            [loading]="deviceService.loading()"
            [disabled]="deviceService.loading()"
            (onClick)="refreshDevices()"
            class="refresh-btn"
          >
            {{ deviceService.loading() ? 'Syncing...' : 'Refresh Network' }}
          </app-button>
        </div>

        @if (deviceService.loading()) {
          <app-card class="loading-card" [glass]="true">
            <div class="loading-content">
              <div class="loading-spinner"></div>
              <p>Scanning device network...</p>
            </div>
          </app-card>
        } @else if (deviceService.devices().length === 0) {
          <app-card class="empty-card" [glass]="true">
            <div class="empty-content">
              <div class="empty-icon">🔍</div>
              <h3>No Devices Found</h3>
              <p>Your IoT network is empty. Start by adding your first device to begin monitoring.</p>
              <app-button variant="default" size="lg" class="add-device-btn">
                Add First Device
              </app-button>
            </div>
          </app-card>
        } @else {
          <div class="devices-grid">
            @for (device of deviceService.devices(); track device.id) {
              <app-card 
                class="device-card" 
                [interactive]="true"
                [glow]="device.status === 'online'"
                [class]="'device-card status-' + device.status"
              >
                <div class="device-header">
                  <div class="device-title">
                    <h3>{{ device.name }}</h3>
                    <app-badge 
                      [variant]="getStatusVariant(device.status)"
                      [pulse]="device.status === 'online'"
                    >
                      {{ device.status }}
                    </app-badge>
                  </div>
                  <div class="device-actions">
                    <button class="action-btn" title="View Details">👁</button>
                    <button class="action-btn" title="Configure">⚙️</button>
                  </div>
                </div>
                
                <div class="device-info">
                  <div class="info-row">
                    <span class="info-label">Type</span>
                    <span class="info-value">{{ device.type }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Device ID</span>
                    <span class="info-value device-id">{{ device.id }}</span>
                  </div>
                  @if (device.metadata?.manufacturer) {
                    <div class="info-row">
                      <span class="info-label">Manufacturer</span>
                      <span class="info-value">{{ device.metadata?.manufacturer }}</span>
                    </div>
                  }
                  @if (device.lastSeenAt) {
                    <div class="info-row">
                      <span class="info-label">Last Seen</span>
                      <span class="info-value">{{ formatDate(device.lastSeenAt) }}</span>
                    </div>
                  }
                </div>

                <div class="device-footer">
                  <div class="signal-strength">
                    <span class="signal-label">Signal</span>
                    <div class="signal-bars">
                      <div class="bar" [class.active]="device.status === 'online'"></div>
                      <div class="bar" [class.active]="device.status === 'online'"></div>
                      <div class="bar" [class.active]="device.status === 'online'"></div>
                      <div class="bar" [class.active]="device.status === 'online'"></div>
                    </div>
                  </div>
                </div>
              </app-card>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      min-height: 100vh;
    }

    /* Header Styles */
    .dashboard-header {
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid hsl(var(--border));
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .header-left {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-icon {
      font-size: 2rem;
      animation: pulse 2s ease-in-out infinite;
    }

    .header-subtitle {
      color: hsl(var(--muted-foreground));
      font-size: 0.875rem;
      margin: 0;
    }

    .header-right {
      display: flex;
      align-items: center;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      background: hsl(var(--muted) / 0.3);
      border-radius: var(--radius);
      border: 1px solid hsl(var(--border));
    }

    .user-avatar {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: hsl(var(--primary-foreground));
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .username {
      font-weight: 600;
      color: hsl(var(--foreground));
    }

    .user-role {
      font-size: 0.75rem;
      color: hsl(var(--muted-foreground));
    }

    /* Stats Grid */
    .dashboard-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      padding: 1.5rem;
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-icon {
      font-size: 2rem;
      opacity: 0.8;
    }

    .stat-icon.connected {
      animation: pulse 2s ease-in-out infinite;
    }

    .stat-info h3 {
      margin: 0 0 0.5rem 0;
      color: hsl(var(--muted-foreground));
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .stat-value {
      margin: 0;
      font-size: 2rem;
      font-weight: 700;
      color: hsl(var(--foreground));
    }

    .stat-value.online {
      color: hsl(142.1 76.2% 36.3%);
    }

    .stat-value.offline {
      color: hsl(var(--destructive));
    }

    .stat-value.connected {
      color: hsl(142.1 76.2% 36.3%);
    }

    /* Device Section */
    .device-section {
      margin-top: 2rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .section-title h2 {
      margin: 0 0 0.5rem 0;
      color: hsl(var(--foreground));
    }

    .section-subtitle {
      color: hsl(var(--muted-foreground));
      font-size: 0.875rem;
      margin: 0;
    }

    /* Loading and Empty States */
    .loading-card, .empty-card {
      padding: 3rem;
      text-align: center;
    }

    .loading-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .loading-spinner {
      width: 2rem;
      height: 2rem;
      border: 2px solid hsl(var(--muted));
      border-top: 2px solid hsl(var(--primary));
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .empty-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .empty-icon {
      font-size: 3rem;
      opacity: 0.5;
    }

    .empty-content h3 {
      margin: 0;
      color: hsl(var(--foreground));
    }

    .empty-content p {
      color: hsl(var(--muted-foreground));
      margin: 0;
    }

    /* Device Grid */
    .devices-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .device-card {
      padding: 1.5rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .device-card:hover {
      transform: translateY(-4px);
    }

    .device-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }

    .device-title {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .device-title h3 {
      margin: 0;
      color: hsl(var(--foreground));
      font-size: 1.125rem;
    }

    .device-actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      width: 2rem;
      height: 2rem;
      border: none;
      background: hsl(var(--muted));
      color: hsl(var(--muted-foreground));
      border-radius: 0.375rem;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .action-btn:hover {
      background: hsl(var(--accent));
      color: hsl(var(--accent-foreground));
    }

    /* Device Info */
    .device-info {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .info-label {
      color: hsl(var(--muted-foreground));
      font-size: 0.875rem;
      font-weight: 500;
    }

    .info-value {
      color: hsl(var(--foreground));
      font-size: 0.875rem;
      font-weight: 600;
    }

    .device-id {
      font-family: 'Monaco', 'Menlo', monospace;
      background: hsl(var(--muted) / 0.3);
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
    }

    /* Device Footer */
    .device-footer {
      border-top: 1px solid hsl(var(--border));
      padding-top: 1rem;
    }

    .signal-strength {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .signal-label {
      color: hsl(var(--muted-foreground));
      font-size: 0.75rem;
      font-weight: 500;
    }

    .signal-bars {
      display: flex;
      gap: 0.25rem;
    }

    .bar {
      width: 0.25rem;
      height: 0.75rem;
      background: hsl(var(--muted));
      border-radius: 0.125rem;
      transition: all 0.3s ease;
    }

    .bar.active {
      background: hsl(var(--primary));
      box-shadow: 0 0 4px hsl(var(--primary) / 0.5);
    }

    .bar:nth-child(1) { height: 0.5rem; }
    .bar:nth-child(2) { height: 0.75rem; }
    .bar:nth-child(3) { height: 1rem; }
    .bar:nth-child(4) { height: 1.25rem; }

    /* Animations */
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.7;
        transform: scale(1.05);
      }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .dashboard {
        padding: 1rem;
      }

      .header-content {
        flex-direction: column;
        align-items: flex-start;
      }

      .user-profile {
        width: 100%;
        justify-content: space-between;
      }

      .dashboard-stats {
        grid-template-columns: 1fr;
      }

      .devices-grid {
        grid-template-columns: 1fr;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
      }
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

  getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' {
    switch (status) {
      case 'online':
        return 'success';
      case 'offline':
        return 'destructive';
      case 'error':
        return 'warning';
      default:
        return 'secondary';
    }
  }
}


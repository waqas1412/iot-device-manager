/**
 * Device Service
 * Demonstrates: Signals, reactive programming, CRUD operations
 */

import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs/operators';

import { ApiService } from '../../../core/services/api.service';

export interface Device {
  id: string;
  name: string;
  type: string;
  status: string;
  userId: string;
  metadata?: {
    manufacturer?: string;
    model?: string;
    firmwareVersion?: string;
  };
  configuration?: {
    reportingInterval: number;
    enabled: boolean;
  };
  createdAt: string;
  updatedAt: string;
  lastSeenAt?: string;
}

export interface DeviceListResponse {
  success: boolean;
  data: Device[];
  meta: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

/**
 * Device Service
 * Demonstrates: Signal-based state management
 */
@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private api = inject(ApiService);

  // Signals for reactive state
  devices = signal<Device[]>([]);
  selectedDevice = signal<Device | null>(null);
  loading = signal<boolean>(false);

  /**
   * Load all devices
   */
  loadDevices() {
    this.loading.set(true);
    return this.api.get<DeviceListResponse>('/devices').pipe(
      tap((response) => {
        if (response.success) {
          this.devices.set(response.data);
        }
        this.loading.set(false);
      })
    );
  }

  /**
   * Get device by ID
   */
  getDevice(id: string) {
    return this.api.get<{ success: boolean; data: Device }>(`/devices/${id}`).pipe(
      tap((response) => {
        if (response.success) {
          this.selectedDevice.set(response.data);
        }
      })
    );
  }

  /**
   * Create new device
   */
  createDevice(deviceData: Partial<Device>) {
    return this.api.post<{ success: boolean; data: Device }>('/devices', deviceData).pipe(
      tap((response) => {
        if (response.success) {
          this.devices.update((devices) => [...devices, response.data]);
        }
      })
    );
  }

  /**
   * Update device
   */
  updateDevice(id: string, deviceData: Partial<Device>) {
    return this.api.put<{ success: boolean; data: Device }>(`/devices/${id}`, deviceData).pipe(
      tap((response) => {
        if (response.success) {
          this.devices.update((devices) =>
            devices.map((d) => (d.id === id ? response.data : d))
          );
        }
      })
    );
  }

  /**
   * Delete device
   */
  deleteDevice(id: string) {
    return this.api.delete(`/devices/${id}`).pipe(
      tap(() => {
        this.devices.update((devices) => devices.filter((d) => d.id !== id));
      })
    );
  }

  /**
   * Update device status
   */
  updateDeviceStatus(id: string, status: string) {
    return this.api
      .patch<{ success: boolean; data: Device }>(`/devices/${id}/status`, { status })
      .pipe(
        tap((response) => {
          if (response.success) {
            this.devices.update((devices) =>
              devices.map((d) => (d.id === id ? response.data : d))
            );
          }
        })
      );
  }
}


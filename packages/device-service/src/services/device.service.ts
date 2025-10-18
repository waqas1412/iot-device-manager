/**
 * Device Service
 * Demonstrates: Business logic layer, dependency injection, SOLID principles
 */

import { v4 as uuidv4 } from 'uuid';

import {
  IDevice,
  IPaginationQuery,
  CreateDeviceInput,
  UpdateDeviceInput,
  ValidationError,
  NotFoundError,
  Logger,
  createDeviceSchema,
  updateDeviceSchema,
  DeviceStatus,
} from '@iot-dm/shared';

import { IDeviceRepository } from '../repositories/device.repository.js';

/**
 * IDeviceService interface
 * Interface Segregation: Define contract for device business logic
 */
export interface IDeviceService {
  createDevice(userId: string, deviceData: CreateDeviceInput): Promise<IDevice>;
  getDevice(id: string, userId: string): Promise<IDevice>;
  getUserDevices(userId: string, query: IPaginationQuery): Promise<{ devices: IDevice[]; total: number }>;
  updateDevice(id: string, userId: string, deviceData: UpdateDeviceInput): Promise<IDevice>;
  deleteDevice(id: string, userId: string): Promise<void>;
  updateDeviceStatus(id: string, userId: string, status: DeviceStatus): Promise<IDevice>;
}

/**
 * Device Service Implementation
 * Single Responsibility: Handle device business logic
 * Dependency Inversion: Depends on IDeviceRepository abstraction
 */
export class DeviceService implements IDeviceService {
  private logger = new Logger('DeviceService');

  /**
   * Constructor with dependency injection
   * Demonstrates: Dependency Injection pattern
   */
  constructor(private deviceRepository: IDeviceRepository) {}

  /**
   * Create a new device
   */
  async createDevice(userId: string, deviceData: CreateDeviceInput): Promise<IDevice> {
    // Validate input
    const validationResult = createDeviceSchema.safeParse(deviceData);
    if (!validationResult.success) {
      throw new ValidationError('Invalid device data', {
        errors: validationResult.error.errors,
      });
    }

    const device = await this.deviceRepository.create({
      ...validationResult.data,
      userId,
      status: DeviceStatus.OFFLINE,
    });

    this.logger.info('Device created', { deviceId: device.id, userId });

    return device;
  }

  /**
   * Get device by ID
   */
  async getDevice(id: string, userId: string): Promise<IDevice> {
    const device = await this.deviceRepository.findById(id);

    if (!device) {
      throw new NotFoundError('Device');
    }

    // Authorization check
    if (device.userId !== userId) {
      throw new NotFoundError('Device');
    }

    return device;
  }

  /**
   * Get all devices for a user
   */
  async getUserDevices(
    userId: string,
    query: IPaginationQuery
  ): Promise<{ devices: IDevice[]; total: number }> {
    return this.deviceRepository.findByUserId(userId, query);
  }

  /**
   * Update device
   */
  async updateDevice(id: string, userId: string, deviceData: UpdateDeviceInput): Promise<IDevice> {
    // Validate input
    const validationResult = updateDeviceSchema.safeParse(deviceData);
    if (!validationResult.success) {
      throw new ValidationError('Invalid device data', {
        errors: validationResult.error.errors,
      });
    }

    // Check ownership
    await this.getDevice(id, userId);

    const updatedDevice = await this.deviceRepository.update(id, validationResult.data);

    this.logger.info('Device updated', { deviceId: id, userId });

    return updatedDevice;
  }

  /**
   * Delete device
   */
  async deleteDevice(id: string, userId: string): Promise<void> {
    // Check ownership
    await this.getDevice(id, userId);

    await this.deviceRepository.delete(id);

    this.logger.info('Device deleted', { deviceId: id, userId });
  }

  /**
   * Update device status
   */
  async updateDeviceStatus(id: string, userId: string, status: DeviceStatus): Promise<IDevice> {
    // Check ownership
    await this.getDevice(id, userId);

    const updatedDevice = await this.deviceRepository.updateStatus(id, status);

    this.logger.info('Device status updated', { deviceId: id, status });

    return updatedDevice;
  }
}


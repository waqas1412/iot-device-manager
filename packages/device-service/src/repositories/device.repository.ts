/**
 * Device Repository
 * Demonstrates: Repository pattern, data access abstraction, SOLID principles
 */

import { DeviceModel, IDeviceDocument } from '../models/device.model.js';
import { IDevice, IPaginationQuery, NotFoundError } from '@iot-dm/shared';

/**
 * IDeviceRepository interface
 * Interface Segregation: Define contract for device data access
 * Dependency Inversion: Depend on abstraction, not concrete implementation
 */
export interface IDeviceRepository {
  create(deviceData: Partial<IDevice>): Promise<IDevice>;
  findById(id: string): Promise<IDevice | null>;
  findByUserId(userId: string, query: IPaginationQuery): Promise<{ devices: IDevice[]; total: number }>;
  update(id: string, deviceData: Partial<IDevice>): Promise<IDevice>;
  delete(id: string): Promise<void>;
  updateStatus(id: string, status: string): Promise<IDevice>;
  updateLastSeen(id: string): Promise<void>;
}

/**
 * Device Repository Implementation
 * Single Responsibility: Handle all device data access operations
 */
export class DeviceRepository implements IDeviceRepository {
  /**
   * Create a new device
   */
  async create(deviceData: Partial<IDevice>): Promise<IDevice> {
    const device = new DeviceModel(deviceData);
    await device.save();
    return device.toJSON() as IDevice;
  }

  /**
   * Find device by ID
   */
  async findById(id: string): Promise<IDevice | null> {
    const device = await DeviceModel.findById(id);
    return device ? (device.toJSON() as IDevice) : null;
  }

  /**
   * Find devices by user ID with pagination
   */
  async findByUserId(
    userId: string,
    query: IPaginationQuery
  ): Promise<{ devices: IDevice[]; total: number }> {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const skip = (page - 1) * limit;
    const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [devices, total] = await Promise.all([
      DeviceModel.find({ userId }).sort(sort).skip(skip).limit(limit).lean(),
      DeviceModel.countDocuments({ userId }),
    ]);

    return {
      devices: devices.map((device) => this.transformDocument(device as any)),
      total,
    };
  }

  /**
   * Update device
   */
  async update(id: string, deviceData: Partial<IDevice>): Promise<IDevice> {
    const device = await DeviceModel.findByIdAndUpdate(id, deviceData, {
      new: true,
      runValidators: true,
    });

    if (!device) {
      throw new NotFoundError('Device');
    }

    return device.toJSON() as IDevice;
  }

  /**
   * Delete device
   */
  async delete(id: string): Promise<void> {
    const result = await DeviceModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundError('Device');
    }
  }

  /**
   * Update device status
   */
  async updateStatus(id: string, status: string): Promise<IDevice> {
    const device = await DeviceModel.findByIdAndUpdate(
      id,
      { status, lastSeenAt: new Date() },
      { new: true }
    );

    if (!device) {
      throw new NotFoundError('Device');
    }

    return device.toJSON() as IDevice;
  }

  /**
   * Update last seen timestamp
   */
  async updateLastSeen(id: string): Promise<void> {
    await DeviceModel.findByIdAndUpdate(id, { lastSeenAt: new Date() });
  }

  /**
   * Transform MongoDB document to IDevice
   * Single Responsibility: Document transformation
   */
  private transformDocument(doc: IDeviceDocument & { _id: unknown }): IDevice {
    const { _id, ...rest } = doc;
    return {
      ...rest,
      id: (_id as { toString(): string }).toString(),
    } as IDevice;
  }
}


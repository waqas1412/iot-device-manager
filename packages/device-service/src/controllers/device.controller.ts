/**
 * Device Controller
 * Demonstrates: Controller pattern, request handling, response formatting
 */

import { Request, Response, NextFunction } from 'express';

import { ApiResponseUtil, DeviceStatus } from '@iot-dm/shared';

import { IDeviceService } from '../services/device.service.js';

/**
 * Device Controller
 * Single Responsibility: Handle HTTP requests and responses for devices
 */
export class DeviceController {
  /**
   * Constructor with dependency injection
   */
  constructor(private deviceService: IDeviceService) {}

  /**
   * Create a new device
   */
  createDevice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.headers['x-user-id'] as string; // From auth middleware
      const device = await this.deviceService.createDevice(userId, req.body);

      res.status(201).json(ApiResponseUtil.success(device));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get device by ID
   */
  getDevice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.headers['x-user-id'] as string;
      const device = await this.deviceService.getDevice(req.params.id, userId);

      res.json(ApiResponseUtil.success(device));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all devices for current user
   */
  getUserDevices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.headers['x-user-id'] as string;
      const { page, limit, sortBy, sortOrder } = req.query;

      const { devices, total } = await this.deviceService.getUserDevices(userId, {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
      });

      res.json(
        ApiResponseUtil.paginated(
          devices,
          Number(page) || 1,
          Number(limit) || 20,
          total
        )
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update device
   */
  updateDevice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.headers['x-user-id'] as string;
      const device = await this.deviceService.updateDevice(req.params.id, userId, req.body);

      res.json(ApiResponseUtil.success(device));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete device
   */
  deleteDevice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.headers['x-user-id'] as string;
      await this.deviceService.deleteDevice(req.params.id, userId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update device status
   */
  updateDeviceStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.headers['x-user-id'] as string;
      const { status } = req.body;

      const device = await this.deviceService.updateDeviceStatus(
        req.params.id,
        userId,
        status as DeviceStatus
      );

      res.json(ApiResponseUtil.success(device));
    } catch (error) {
      next(error);
    }
  };
}


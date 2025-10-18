/**
 * Device routes
 * Demonstrates: RESTful API design, route organization
 */

import { Router } from 'express';

import { DeviceController } from '../controllers/device.controller.js';

/**
 * Create device routes
 * Single Responsibility: Define device-related routes
 */
export function createDeviceRoutes(deviceController: DeviceController): Router {
  const router = Router();

  // CRUD operations
  router.post('/', deviceController.createDevice);
  router.get('/', deviceController.getUserDevices);
  router.get('/:id', deviceController.getDevice);
  router.put('/:id', deviceController.updateDevice);
  router.delete('/:id', deviceController.deleteDevice);

  // Status update
  router.patch('/:id/status', deviceController.updateDeviceStatus);

  return router;
}


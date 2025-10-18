/**
 * Device validation schemas using Zod
 * Demonstrates: Input validation, type safety, runtime checks
 */

import { z } from 'zod';

import { VALIDATION_RULES } from '../constants/index.js';
import { DeviceStatus, DeviceType } from '../types/index.js';

/**
 * Device location schema
 */
export const deviceLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().optional(),
});

/**
 * Device metadata schema
 */
export const deviceMetadataSchema = z.object({
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  firmwareVersion: z.string().optional(),
  hardwareVersion: z.string().optional(),
  serialNumber: z.string().optional(),
  location: deviceLocationSchema.optional(),
});

/**
 * Device configuration schema
 */
export const deviceConfigurationSchema = z.object({
  reportingInterval: z.number().min(1).max(3600),
  enabled: z.boolean(),
  settings: z.record(z.unknown()),
});

/**
 * Create device schema
 */
export const createDeviceSchema = z.object({
  name: z
    .string()
    .min(VALIDATION_RULES.DEVICE_NAME.MIN_LENGTH)
    .max(VALIDATION_RULES.DEVICE_NAME.MAX_LENGTH),
  type: z.nativeEnum(DeviceType),
  metadata: deviceMetadataSchema.optional(),
  configuration: deviceConfigurationSchema.optional(),
});

/**
 * Update device schema
 */
export const updateDeviceSchema = z.object({
  name: z
    .string()
    .min(VALIDATION_RULES.DEVICE_NAME.MIN_LENGTH)
    .max(VALIDATION_RULES.DEVICE_NAME.MAX_LENGTH)
    .optional(),
  status: z.nativeEnum(DeviceStatus).optional(),
  metadata: deviceMetadataSchema.optional(),
  configuration: deviceConfigurationSchema.optional(),
});

/**
 * Device metrics schema
 */
export const deviceMetricsSchema = z.object({
  deviceId: z.string().uuid(),
  timestamp: z.date(),
  metrics: z.record(z.union([z.number(), z.string(), z.boolean()])),
});

/**
 * Device command schema
 */
export const deviceCommandSchema = z.object({
  deviceId: z.string().uuid(),
  command: z.string().min(1),
  parameters: z.record(z.unknown()).optional(),
});

// Export inferred types
export type CreateDeviceInput = z.infer<typeof createDeviceSchema>;
export type UpdateDeviceInput = z.infer<typeof updateDeviceSchema>;
export type DeviceMetricsInput = z.infer<typeof deviceMetricsSchema>;
export type DeviceCommandInput = z.infer<typeof deviceCommandSchema>;


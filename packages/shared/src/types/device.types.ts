/**
 * Device-related type definitions
 * Demonstrates: Type safety, clear interfaces, documentation
 */

export enum DeviceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  ERROR = 'error',
  MAINTENANCE = 'maintenance',
}

export enum DeviceType {
  SENSOR = 'sensor',
  ACTUATOR = 'actuator',
  GATEWAY = 'gateway',
  CONTROLLER = 'controller',
}

export interface IDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  userId: string;
  metadata: IDeviceMetadata;
  configuration: IDeviceConfiguration;
  createdAt: Date;
  updatedAt: Date;
  lastSeenAt?: Date;
}

export interface IDeviceMetadata {
  manufacturer?: string;
  model?: string;
  firmwareVersion?: string;
  hardwareVersion?: string;
  serialNumber?: string;
  location?: IDeviceLocation;
}

export interface IDeviceLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface IDeviceConfiguration {
  reportingInterval: number; // in seconds
  enabled: boolean;
  settings: Record<string, unknown>;
}

export interface IDeviceMetrics {
  deviceId: string;
  timestamp: Date;
  metrics: Record<string, number | string | boolean>;
}

export interface IDeviceCommand {
  deviceId: string;
  command: string;
  parameters?: Record<string, unknown>;
  timestamp: Date;
}

export interface IDeviceEvent {
  deviceId: string;
  eventType: string;
  data: Record<string, unknown>;
  timestamp: Date;
}


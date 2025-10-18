/**
 * Device Mongoose model
 * Demonstrates: Schema definition, indexing, data modeling
 */

import mongoose, { Schema, Document } from 'mongoose';

import { IDevice, DeviceStatus, DeviceType } from '@iot-dm/shared';

/**
 * Device document interface
 * Interface Segregation: Extends both IDevice and Document
 */
export interface IDeviceDocument extends Omit<IDevice, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

/**
 * Device schema definition
 * Demonstrates: Proper schema design, validation, defaults
 */
const deviceSchema = new Schema<IDeviceDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    type: {
      type: String,
      enum: Object.values(DeviceType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(DeviceStatus),
      default: DeviceStatus.OFFLINE,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    metadata: {
      manufacturer: String,
      model: String,
      firmwareVersion: String,
      hardwareVersion: String,
      serialNumber: String,
      location: {
        latitude: Number,
        longitude: Number,
        address: String,
      },
    },
    configuration: {
      reportingInterval: {
        type: Number,
        default: 60,
        min: 1,
        max: 3600,
      },
      enabled: {
        type: Boolean,
        default: true,
      },
      settings: {
        type: Map,
        of: Schema.Types.Mixed,
        default: {},
      },
    },
    lastSeenAt: Date,
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for performance
deviceSchema.index({ userId: 1, status: 1 });
deviceSchema.index({ type: 1 });
deviceSchema.index({ createdAt: -1 });

/**
 * Device model
 */
export const DeviceModel = mongoose.model<IDeviceDocument>('Device', deviceSchema);


/**
 * User Mongoose model
 * Demonstrates: Secure password handling, schema design
 */

import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

import { IUser, UserRole } from '@iot-dm/shared';

/**
 * User document interface
 */
export interface IUserDocument extends Omit<IUser, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * User schema definition
 */
const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Don't include password by default
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    profile: {
      firstName: String,
      lastName: String,
      avatar: String,
      phone: String,
    },
    lastLoginAt: Date,
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

/**
 * Hash password before saving
 * Demonstrates: Security best practice, pre-save hooks
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

/**
 * Compare password method
 * Demonstrates: Instance methods, secure password comparison
 */
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = mongoose.model<IUserDocument>('User', userSchema);


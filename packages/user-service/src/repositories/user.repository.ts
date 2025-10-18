/**
 * User Repository
 * Demonstrates: Repository pattern, data access abstraction
 */

import { UserModel, IUserDocument } from '../models/user.model.js';
import { IUser, NotFoundError, ConflictError } from '@iot-dm/shared';

/**
 * IUserRepository interface
 */
export interface IUserRepository {
  create(userData: Partial<IUser> & { password: string }): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findByEmailWithPassword(email: string): Promise<IUserDocument | null>;
  update(id: string, userData: Partial<IUser>): Promise<IUser>;
  updateLastLogin(id: string): Promise<void>;
}

/**
 * User Repository Implementation
 */
export class UserRepository implements IUserRepository {
  /**
   * Create a new user
   */
  async create(userData: Partial<IUser> & { password: string }): Promise<IUser> {
    // Check if user already exists
    const existingUser = await UserModel.findOne({
      $or: [{ email: userData.email }, { username: userData.username }],
    });

    if (existingUser) {
      throw new ConflictError('User with this email or username already exists');
    }

    const user = new UserModel(userData);
    await user.save();
    return user.toJSON() as IUser;
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<IUser | null> {
    const user = await UserModel.findById(id);
    return user ? (user.toJSON() as IUser) : null;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    return user ? (user.toJSON() as IUser) : null;
  }

  /**
   * Find user by email with password (for authentication)
   */
  async findByEmailWithPassword(email: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ email: email.toLowerCase() }).select('+password');
  }

  /**
   * Update user
   */
  async update(id: string, userData: Partial<IUser>): Promise<IUser> {
    const user = await UserModel.findByIdAndUpdate(id, userData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    return user.toJSON() as IUser;
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(id: string): Promise<void> {
    await UserModel.findByIdAndUpdate(id, { lastLoginAt: new Date() });
  }
}


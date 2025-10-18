/**
 * User validation schemas using Zod
 * Demonstrates: Security-focused validation, password complexity
 */

import { z } from 'zod';

import { VALIDATION_RULES } from '../constants/index.js';
import { UserRole } from '../types/index.js';

/**
 * User profile schema
 */
export const userProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  avatar: z.string().url().optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
});

/**
 * Register user schema
 */
export const registerUserSchema = z.object({
  email: z
    .string()
    .email()
    .min(VALIDATION_RULES.EMAIL.MIN_LENGTH)
    .max(VALIDATION_RULES.EMAIL.MAX_LENGTH)
    .regex(VALIDATION_RULES.EMAIL.PATTERN),
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_-]+$/),
  password: z
    .string()
    .min(VALIDATION_RULES.PASSWORD.MIN_LENGTH)
    .max(VALIDATION_RULES.PASSWORD.MAX_LENGTH)
    .regex(
      VALIDATION_RULES.PASSWORD.PATTERN,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  profile: userProfileSchema.optional(),
});

/**
 * Login schema
 */
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * Update user schema
 */
export const updateUserSchema = z.object({
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  profile: userProfileSchema.optional(),
  role: z.nativeEnum(UserRole).optional(),
});

/**
 * Change password schema
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(VALIDATION_RULES.PASSWORD.MIN_LENGTH)
    .max(VALIDATION_RULES.PASSWORD.MAX_LENGTH)
    .regex(VALIDATION_RULES.PASSWORD.PATTERN),
});

// Export inferred types
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;


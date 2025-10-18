/**
 * User-related type definitions
 * Demonstrates: RBAC, type safety, security considerations
 */

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  VIEWER = 'viewer',
}

export interface IUser {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  profile: IUserProfile;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface IUserProfile {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
}

export interface IAuthCredentials {
  email: string;
  password: string;
}

export interface IAuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ITokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}


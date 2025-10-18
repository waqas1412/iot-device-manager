/**
 * JWT utility functions
 * Demonstrates: Token-based authentication, security best practices
 */

import jwt from 'jsonwebtoken';

import { ITokenPayload, IAuthToken, APP_CONSTANTS } from '@iot-dm/shared';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production';

/**
 * Generate access token
 * Single Responsibility: Create JWT access tokens
 */
export function generateAccessToken(payload: Omit<ITokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: APP_CONSTANTS.JWT.ACCESS_TOKEN_EXPIRY,
    algorithm: APP_CONSTANTS.JWT.ALGORITHM,
  });
}

/**
 * Generate refresh token
 * Single Responsibility: Create JWT refresh tokens
 */
export function generateRefreshToken(payload: Omit<ITokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: APP_CONSTANTS.JWT.REFRESH_TOKEN_EXPIRY,
    algorithm: APP_CONSTANTS.JWT.ALGORITHM,
  });
}

/**
 * Generate token pair
 * Demonstrates: DRY principle, token generation
 */
export function generateTokens(
  userId: string,
  email: string,
  role: string
): IAuthToken {
  const payload: Omit<ITokenPayload, 'iat' | 'exp'> = { userId, email, role };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
    expiresIn: 900, // 15 minutes in seconds
  };
}

/**
 * Verify access token
 * Single Responsibility: Validate JWT access tokens
 */
export function verifyAccessToken(token: string): ITokenPayload {
  return jwt.verify(token, JWT_SECRET) as ITokenPayload;
}

/**
 * Verify refresh token
 * Single Responsibility: Validate JWT refresh tokens
 */
export function verifyRefreshToken(token: string): ITokenPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET) as ITokenPayload;
}


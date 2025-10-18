/**
 * Authentication Service
 * Demonstrates: Business logic separation, security best practices
 */

import {
  IUser,
  IAuthToken,
  LoginInput,
  RegisterUserInput,
  ValidationError,
  AuthenticationError,
  Logger,
  registerUserSchema,
  loginSchema,
} from '@iot-dm/shared';

import { IUserRepository } from '../repositories/user.repository.js';
import { generateTokens } from '../config/jwt.util.js';

/**
 * IAuthService interface
 */
export interface IAuthService {
  register(userData: RegisterUserInput): Promise<{ user: IUser; tokens: IAuthToken }>;
  login(credentials: LoginInput): Promise<{ user: IUser; tokens: IAuthToken }>;
}

/**
 * Authentication Service Implementation
 * Single Responsibility: Handle authentication logic
 */
export class AuthService implements IAuthService {
  private logger = new Logger('AuthService');

  constructor(private userRepository: IUserRepository) {}

  /**
   * Register a new user
   */
  async register(userData: RegisterUserInput): Promise<{ user: IUser; tokens: IAuthToken }> {
    // Validate input
    const validationResult = registerUserSchema.safeParse(userData);
    if (!validationResult.success) {
      throw new ValidationError('Invalid registration data', {
        errors: validationResult.error.errors,
      });
    }

    const user = await this.userRepository.create(validationResult.data);

    this.logger.info('User registered', { userId: user.id, email: user.email });

    const tokens = generateTokens(user.id, user.email, user.role);

    return { user, tokens };
  }

  /**
   * Login user
   */
  async login(credentials: LoginInput): Promise<{ user: IUser; tokens: IAuthToken }> {
    // Validate input
    const validationResult = loginSchema.safeParse(credentials);
    if (!validationResult.success) {
      throw new ValidationError('Invalid login credentials', {
        errors: validationResult.error.errors,
      });
    }

    const { email, password } = validationResult.data;

    // Find user with password
    const userDoc = await this.userRepository.findByEmailWithPassword(email);

    if (!userDoc) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await userDoc.comparePassword(password);

    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Update last login
    await this.userRepository.updateLastLogin(userDoc._id.toString());

    this.logger.info('User logged in', { userId: userDoc._id.toString(), email: userDoc.email });

    const user = userDoc.toJSON() as IUser;
    const tokens = generateTokens(user.id, user.email, user.role);

    return { user, tokens };
  }
}


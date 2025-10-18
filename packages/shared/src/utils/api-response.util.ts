/**
 * API Response utility functions
 * Demonstrates: DRY principle, consistent response formatting
 */

import { IApiError, IApiMeta, IApiResponse } from '../types/index.js';

export class ApiResponseUtil {
  /**
   * Create a successful API response
   * Single Responsibility: Only handles success responses
   */
  static success<T>(data: T, meta?: Partial<IApiMeta>): IApiResponse<T> {
    return {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    };
  }

  /**
   * Create an error API response
   * Single Responsibility: Only handles error responses
   */
  static error(error: IApiError, meta?: Partial<IApiMeta>): IApiResponse {
    return {
      success: false,
      error,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    };
  }

  /**
   * Create a paginated response
   * Single Responsibility: Only handles paginated responses
   */
  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number
  ): IApiResponse<T[]> {
    return {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }
}


/**
 * MongoDB connection configuration
 * Demonstrates: Database connection management, connection pooling
 */

import mongoose from 'mongoose';

import { APP_CONSTANTS, Logger } from '@iot-dm/shared';

const logger = new Logger('Database');

/**
 * Connect to MongoDB
 */
export async function connectDatabase(): Promise<void> {
  try {
    const uri = APP_CONSTANTS.DATABASE.MONGODB_URI;

    await mongoose.connect(uri, {
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info('Connected to MongoDB', {
      database: mongoose.connection.name,
    });

    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });
  } catch (error) {
    logger.error('Failed to connect to MongoDB', error as Error);
    throw error;
  }
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
  } catch (error) {
    logger.error('Error disconnecting from MongoDB', error as Error);
    throw error;
  }
}


import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'IoT Device Manager API',
    version: '1.0.0',
    description: 'Comprehensive IoT Device Management System with Microservices Architecture',
    contact: {
      name: 'API Support',
      email: 'support@iot-device-manager.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
    {
      url: 'http://localhost:3000/api',
      description: 'API Gateway',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token',
      },
    },
    schemas: {
      Device: {
        type: 'object',
        required: ['name', 'type'],
        properties: {
          id: {
            type: 'string',
            description: 'Device unique identifier',
            example: '507f1f77bcf86cd799439011',
          },
          name: {
            type: 'string',
            description: 'Device name',
            example: 'Temperature Sensor 1',
          },
          type: {
            type: 'string',
            enum: ['sensor', 'actuator', 'gateway', 'controller'],
            description: 'Device type',
            example: 'sensor',
          },
          status: {
            type: 'string',
            enum: ['online', 'offline', 'error'],
            description: 'Device status',
            example: 'online',
          },
          userId: {
            type: 'string',
            description: 'Owner user ID',
            example: '507f1f77bcf86cd799439012',
          },
          metadata: {
            type: 'object',
            properties: {
              manufacturer: { type: 'string', example: 'Acme Corp' },
              model: { type: 'string', example: 'TS-100' },
              firmwareVersion: { type: 'string', example: '1.2.3' },
              location: { type: 'string', example: 'Building A - Floor 1' },
              serialNumber: { type: 'string', example: 'SN-TEMP-1001' },
            },
          },
          configuration: {
            type: 'object',
            properties: {
              reportingInterval: { type: 'number', example: 60 },
              enabled: { type: 'boolean', example: true },
            },
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
          },
          lastSeenAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last seen timestamp',
          },
        },
      },
      User: {
        type: 'object',
        required: ['email', 'username', 'password'],
        properties: {
          id: {
            type: 'string',
            description: 'User unique identifier',
            example: '507f1f77bcf86cd799439011',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'user@example.com',
          },
          username: {
            type: 'string',
            description: 'Username',
            example: 'johndoe',
          },
          role: {
            type: 'string',
            enum: ['user', 'admin'],
            description: 'User role',
            example: 'user',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
          },
        },
      },
      Metrics: {
        type: 'object',
        properties: {
          deviceId: {
            type: 'string',
            example: '507f1f77bcf86cd799439011',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
          },
          metrics: {
            type: 'object',
            properties: {
              temperature: { type: 'number', example: 23.5 },
              humidity: { type: 'number', example: 65.2 },
              pressure: { type: 'number', example: 1013.25 },
              battery: { type: 'number', example: 85 },
              signalStrength: { type: 'number', example: 92 },
            },
          },
        },
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'object',
          },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              message: { type: 'string' },
              details: { type: 'object' },
            },
          },
          meta: {
            type: 'object',
            properties: {
              pagination: {
                type: 'object',
                properties: {
                  page: { type: 'number', example: 1 },
                  limit: { type: 'number', example: 10 },
                  total: { type: 'number', example: 100 },
                  totalPages: { type: 'number', example: 10 },
                },
              },
            },
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
                example: 'VALIDATION_ERROR',
              },
              message: {
                type: 'string',
                example: 'Invalid input data',
              },
              details: {
                type: 'object',
              },
            },
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'User authentication and authorization endpoints',
    },
    {
      name: 'Devices',
      description: 'IoT device management endpoints',
    },
    {
      name: 'Analytics',
      description: 'Device metrics and analytics endpoints',
    },
    {
      name: 'Notifications',
      description: 'Real-time notification endpoints',
    },
  ],
};

const options: swaggerJsdoc.Options = {
  swaggerDefinition,
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
    '../device-service/src/routes/*.ts',
    '../user-service/src/routes/*.ts',
    '../analytics-service/src/routes/*.ts',
    '../notification-service/src/routes/*.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);


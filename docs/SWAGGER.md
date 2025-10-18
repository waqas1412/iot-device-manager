# Swagger API Documentation

## Overview

The IoT Device Manager includes comprehensive **Swagger/OpenAPI 3.0** documentation for all API endpoints, making it easy to explore, test, and integrate with the API.

## Accessing Swagger UI

Once the application is running, access the interactive API documentation at:

**Swagger UI**: http://localhost:3000/api-docs

**OpenAPI JSON**: http://localhost:3000/api-docs.json

## Features

The Swagger documentation provides comprehensive information about the API, including detailed endpoint descriptions, request and response schemas, authentication requirements, and the ability to test endpoints directly from the browser interface.

### Interactive API Testing

The Swagger UI allows you to test API endpoints directly from your browser without needing external tools like Postman or curl. You can authenticate using JWT tokens, execute requests with custom parameters, and view real-time responses with proper formatting and syntax highlighting.

### Authentication

Most endpoints require JWT authentication. To test protected endpoints, you need to obtain a token by logging in through the authentication endpoint, then click the "Authorize" button in Swagger UI and enter your token in the format `Bearer <your_token>`.

The authentication flow works as follows: first, register or login using the `/auth/login` endpoint to receive an access token, then click the "Authorize" button at the top of the Swagger UI, enter `Bearer <your_access_token>`, and finally use any protected endpoint with automatic token inclusion.

### API Endpoints

The documentation covers all major endpoint categories including Authentication endpoints for user registration, login, and profile management; Devices endpoints for complete CRUD operations on IoT devices; Analytics endpoints for metrics storage, retrieval, and historical data; and Notifications endpoints for real-time event management.

## Endpoint Categories

### Authentication

Authentication endpoints handle user management and JWT token generation. The `/auth/register` endpoint creates new user accounts, `/auth/login` authenticates users and returns JWT tokens, and `/auth/profile` retrieves the authenticated user's profile information.

### Devices

Device endpoints provide full device lifecycle management. The `GET /devices` endpoint lists all devices with pagination and filtering, `POST /devices` creates new devices, `GET /devices/{id}` retrieves specific device details, `PUT /devices/{id}` updates device information, `DELETE /devices/{id}` removes devices, and `PATCH /devices/{id}/status` updates device status.

### Analytics

Analytics endpoints manage device metrics and performance data. The `POST /analytics/devices/{deviceId}/metrics` endpoint stores new metrics, `GET /analytics/devices/{deviceId}/metrics` retrieves current metrics, `GET /analytics/devices/{deviceId}/metrics/history` fetches historical data, and `GET /analytics/devices/{deviceId}/stats` provides aggregated statistics.

### Notifications

Notification endpoints handle real-time event distribution. The `POST /notifications/send` endpoint broadcasts notifications to connected clients, and `POST /events/device` publishes device-related events to the system.

## Request/Response Examples

The Swagger UI includes comprehensive examples for all endpoints, showing proper request formatting with sample data and expected response structures with status codes.

### Example: Create Device

Creating a device requires a POST request to `/devices` with a JSON body containing the device name, type, and optional metadata and configuration. The response returns the created device with a generated ID, timestamps, and default status.

### Example: Get Devices

Retrieving devices uses a GET request to `/devices` with optional query parameters for pagination (page, limit) and filtering (status, type). The response includes an array of devices and pagination metadata.

## Data Models

The Swagger documentation defines all data models used in the API, providing clear schema definitions with field types, constraints, and example values.

### Device Schema

The Device schema includes required fields like id, name, and type, along with optional fields such as status, userId, metadata (manufacturer, model, firmwareVersion, location), configuration (reportingInterval, enabled), and timestamps (createdAt, updatedAt, lastSeenAt).

### User Schema

The User schema contains essential user information including id, email, username, role (user or admin), and timestamps for account creation and updates.

### Metrics Schema

The Metrics schema captures device performance data with fields for deviceId, timestamp, and a flexible metrics object containing sensor readings like temperature, humidity, pressure, battery level, and signal strength.

## Response Format

All API responses follow a consistent structure defined in the ApiResponse schema, ensuring predictable and easy-to-parse results.

### Success Response

Successful responses include a success flag set to true, a data object containing the requested information or operation result, and optional meta information such as pagination details.

### Error Response

Error responses include a success flag set to false and an error object containing a specific error code, a human-readable message, and optional details providing additional context about the failure.

## Using Swagger for Development

Swagger documentation serves multiple purposes in the development workflow, including API exploration for understanding available endpoints, interactive testing without external tools, client code generation using the OpenAPI specification, and integration planning by understanding request/response formats.

### Testing Workflow

A typical testing workflow involves opening Swagger UI in your browser, authenticating by logging in and copying the access token, authorizing by clicking "Authorize" and entering the Bearer token, exploring endpoints by browsing available operations, testing by filling in parameters and executing requests, and reviewing responses to verify correct behavior.

### Code Generation

The OpenAPI specification can be used to generate client libraries in various programming languages using tools like Swagger Codegen or OpenAPI Generator, supporting languages such as JavaScript/TypeScript, Python, Java, C#, Go, and many others.

## Best Practices

When using the Swagger documentation, follow these best practices: always authenticate before testing protected endpoints, use the "Try it out" feature to test with real data, review response schemas to understand data structures, check error responses to handle edge cases, export the OpenAPI spec for offline use or code generation, and refer to example values for proper request formatting.

## Additional Resources

For more information, consult the main API documentation at `docs/API.md`, review the architecture documentation at `ARCHITECTURE.md`, explore the project README at `README.md`, and access the live Swagger UI at http://localhost:3000/api-docs.

## OpenAPI Specification

The complete OpenAPI 3.0 specification is available in JSON format at http://localhost:3000/api-docs.json, which can be imported into API development tools, used for automated testing, integrated with API gateways, and utilized for client code generation.

## Support

If you encounter issues with the API documentation or have suggestions for improvements, please open an issue on the GitHub repository or refer to the CONTRIBUTING.md file for guidelines on submitting improvements.


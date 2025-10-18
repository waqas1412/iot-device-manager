# API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Endpoints

### Authentication

#### Register User

```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "username": "johndoe",
      "role": "user"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
}
```

#### Login

```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "username": "johndoe",
      "role": "user"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
}
```

#### Get Profile

```http
GET /auth/profile
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "johndoe",
    "role": "user"
  }
}
```

### Devices

#### List Devices

```http
GET /devices?page=1&limit=10&status=online
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status
- `type` (optional): Filter by device type

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Temperature Sensor 1",
      "type": "sensor",
      "status": "online",
      "userId": "507f1f77bcf86cd799439012",
      "metadata": {
        "manufacturer": "Acme Corp",
        "model": "TS-100",
        "firmwareVersion": "1.2.3"
      },
      "configuration": {
        "reportingInterval": 60,
        "enabled": true
      },
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z",
      "lastSeenAt": "2025-01-01T12:00:00.000Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

#### Get Device

```http
GET /devices/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Temperature Sensor 1",
    "type": "sensor",
    "status": "online",
    ...
  }
}
```

#### Create Device

```http
POST /devices
```

**Request Body:**
```json
{
  "name": "Temperature Sensor 1",
  "type": "sensor",
  "metadata": {
    "manufacturer": "Acme Corp",
    "model": "TS-100",
    "firmwareVersion": "1.2.3"
  },
  "configuration": {
    "reportingInterval": 60,
    "enabled": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Temperature Sensor 1",
    ...
  }
}
```

#### Update Device

```http
PUT /devices/:id
```

**Request Body:**
```json
{
  "name": "Updated Sensor Name",
  "configuration": {
    "reportingInterval": 120,
    "enabled": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Updated Sensor Name",
    ...
  }
}
```

#### Update Device Status

```http
PATCH /devices/:id/status
```

**Request Body:**
```json
{
  "status": "offline"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "status": "offline",
    ...
  }
}
```

#### Delete Device

```http
DELETE /devices/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Device deleted successfully"
  }
}
```

### Analytics

#### Store Device Metrics

```http
POST /analytics/devices/:deviceId/metrics
```

**Request Body:**
```json
{
  "temperature": 23.5,
  "humidity": 65.2,
  "pressure": 1013.25,
  "battery": 85,
  "signalStrength": 92
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Metrics stored successfully"
  }
}
```

#### Get Current Metrics

```http
GET /analytics/devices/:deviceId/metrics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "deviceId": "507f1f77bcf86cd799439011",
    "timestamp": "2025-01-01T12:00:00.000Z",
    "metrics": {
      "temperature": 23.5,
      "humidity": 65.2,
      "pressure": 1013.25,
      "battery": 85,
      "signalStrength": 92
    }
  }
}
```

#### Get Metrics History

```http
GET /analytics/devices/:deviceId/metrics/history?limit=10
```

**Query Parameters:**
- `limit` (optional): Number of entries to return (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "deviceId": "507f1f77bcf86cd799439011",
      "timestamp": "2025-01-01T12:00:00.000Z",
      "metrics": {
        "temperature": 23.5,
        ...
      }
    },
    ...
  ]
}
```

#### Get Aggregated Stats

```http
GET /analytics/devices/:deviceId/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 150,
    "latest": {
      "deviceId": "507f1f77bcf86cd799439011",
      "timestamp": "2025-01-01T12:00:00.000Z",
      "metrics": {...}
    },
    "history": [...]
  }
}
```

### Notifications

#### Send Notification

```http
POST /notifications/send
```

**Request Body:**
```json
{
  "type": "alert",
  "message": "Device temperature threshold exceeded",
  "data": {
    "deviceId": "507f1f77bcf86cd799439011",
    "temperature": 45.2
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Notification sent"
  }
}
```

#### Publish Device Event

```http
POST /events/device
```

**Request Body:**
```json
{
  "type": "status_changed",
  "deviceId": "507f1f77bcf86cd799439011",
  "data": {
    "oldStatus": "online",
    "newStatus": "offline"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Event published"
  }
}
```

## WebSocket

### Connection

```javascript
const ws = new WebSocket('ws://localhost:3003');

ws.onopen = () => {
  console.log('Connected to notification service');
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Received:', message);
};
```

### Message Types

#### Connection Confirmation

```json
{
  "type": "connection",
  "data": {
    "clientId": "client_1234567890_abc123",
    "message": "Connected to notification service"
  }
}
```

#### Device Status Changed

```json
{
  "type": "device:status:changed",
  "data": {
    "type": "status_changed",
    "deviceId": "507f1f77bcf86cd799439011",
    "data": {
      "oldStatus": "online",
      "newStatus": "offline"
    }
  }
}
```

#### Notification Sent

```json
{
  "type": "notification:sent",
  "data": {
    "type": "alert",
    "message": "Device temperature threshold exceeded",
    "data": {...}
  }
}
```

### Client Messages

#### Ping

```json
{
  "type": "ping"
}
```

**Response:**
```json
{
  "type": "pong",
  "timestamp": 1704110400000
}
```

#### Subscribe to Room

```json
{
  "type": "subscribe",
  "room": "device:507f1f77bcf86cd799439011"
}
```

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR`: Invalid input data
- `AUTHENTICATION_ERROR`: Missing or invalid authentication
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource already exists
- `INTERNAL_ERROR`: Server error

### HTTP Status Codes

- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error


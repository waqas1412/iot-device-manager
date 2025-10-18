# Testing Guide

## Test Strategy

This project follows a comprehensive testing strategy:

1. **Unit Tests**: Test individual functions and classes
2. **Integration Tests**: Test service interactions
3. **E2E Tests**: Test complete user workflows
4. **API Tests**: Test REST endpoints
5. **Performance Tests**: Test system under load

## Running Tests

### All Tests

```bash
npm test
```

### Specific Package

```bash
cd packages/device-service
npm test
```

### Watch Mode

```bash
npm test -- --watch
```

### Coverage

```bash
npm test -- --coverage
```

## Unit Testing

### Example: Testing a Service

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { DeviceService } from './device.service';
import { MockDeviceRepository } from '../__mocks__/device.repository';

describe('DeviceService', () => {
  let service: DeviceService;
  let repository: MockDeviceRepository;

  beforeEach(() => {
    repository = new MockDeviceRepository();
    service = new DeviceService(repository);
  });

  it('should create a device', async () => {
    const deviceData = {
      name: 'Test Device',
      type: 'sensor',
    };

    const device = await service.createDevice(deviceData);

    expect(device).toBeDefined();
    expect(device.name).toBe('Test Device');
    expect(device.type).toBe('sensor');
  });

  it('should throw error for invalid device type', async () => {
    const deviceData = {
      name: 'Test Device',
      type: 'invalid',
    };

    await expect(service.createDevice(deviceData)).rejects.toThrow();
  });
});
```

## Integration Testing

### Example: Testing API Endpoints

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from './server';

describe('Device API', () => {
  let app;
  let token;

  beforeAll(async () => {
    app = await createApp();
    
    // Login to get token
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });
    
    token = response.body.data.tokens.accessToken;
  });

  it('should list devices', async () => {
    const response = await request(app)
      .get('/devices')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should create a device', async () => {
    const response = await request(app)
      .post('/devices')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Device',
        type: 'sensor',
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe('Test Device');
  });
});
```

## E2E Testing

### Example: Testing User Flow

```typescript
import { test, expect } from '@playwright/test';

test.describe('Device Management Flow', () => {
  test('should complete full device lifecycle', async ({ page }) => {
    // Login
    await page.goto('http://localhost:4200/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Wait for dashboard
    await expect(page).toHaveURL('http://localhost:4200/dashboard');

    // Create device
    await page.click('button:has-text("Add Device")');
    await page.fill('input[name="name"]', 'Test Sensor');
    await page.selectOption('select[name="type"]', 'sensor');
    await page.click('button:has-text("Create")');

    // Verify device appears
    await expect(page.locator('text=Test Sensor')).toBeVisible();

    // Update device
    await page.click('text=Test Sensor');
    await page.click('button:has-text("Edit")');
    await page.fill('input[name="name"]', 'Updated Sensor');
    await page.click('button:has-text("Save")');

    // Verify update
    await expect(page.locator('text=Updated Sensor')).toBeVisible();

    // Delete device
    await page.click('button:has-text("Delete")');
    await page.click('button:has-text("Confirm")');

    // Verify deletion
    await expect(page.locator('text=Updated Sensor')).not.toBeVisible();
  });
});
```

## API Testing with Postman

### Collection Structure

```
IoT Device Manager
├── Authentication
│   ├── Register
│   ├── Login
│   └── Get Profile
├── Devices
│   ├── List Devices
│   ├── Create Device
│   ├── Get Device
│   ├── Update Device
│   ├── Update Status
│   └── Delete Device
├── Analytics
│   ├── Store Metrics
│   ├── Get Metrics
│   ├── Get History
│   └── Get Stats
└── Notifications
    ├── Send Notification
    └── Publish Event
```

### Environment Variables

```json
{
  "baseUrl": "http://localhost:3000/api",
  "accessToken": "",
  "deviceId": ""
}
```

## Performance Testing

### Load Testing with Artillery

```yaml
# artillery.yml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Sustained load"
    - duration: 60
      arrivalRate: 100
      name: "Peak load"

scenarios:
  - name: "Device API"
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "test@example.com"
            password: "password123"
          capture:
            - json: "$.data.tokens.accessToken"
              as: "token"
      - get:
          url: "/api/devices"
          headers:
            Authorization: "Bearer {{ token }}"
```

Run with:
```bash
artillery run artillery.yml
```

## Test Coverage Goals

- **Unit Tests**: > 80% coverage
- **Integration Tests**: All API endpoints
- **E2E Tests**: Critical user flows
- **Performance Tests**: All high-traffic endpoints

## Continuous Integration

Tests run automatically on:
- Every push to main/develop
- Every pull request
- Scheduled nightly builds

## Mocking

### Mock Repository

```typescript
export class MockDeviceRepository implements IDeviceRepository {
  private devices: Map<string, IDevice> = new Map();

  async create(data: Partial<IDevice>): Promise<IDevice> {
    const device: IDevice = {
      id: Math.random().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as IDevice;

    this.devices.set(device.id, device);
    return device;
  }

  async findById(id: string): Promise<IDevice | null> {
    return this.devices.get(id) || null;
  }

  // ... other methods
}
```

### Mock External Services

```typescript
export class MockRedisClient {
  private data: Map<string, string> = new Map();

  async get(key: string): Promise<string | null> {
    return this.data.get(key) || null;
  }

  async set(key: string, value: string): Promise<void> {
    this.data.set(key, value);
  }

  // ... other methods
}
```

## Test Data

### Fixtures

```typescript
export const testDevices = [
  {
    id: '1',
    name: 'Temperature Sensor 1',
    type: 'sensor',
    status: 'online',
  },
  {
    id: '2',
    name: 'Smart Actuator 1',
    type: 'actuator',
    status: 'offline',
  },
];

export const testUsers = [
  {
    id: '1',
    email: 'admin@example.com',
    username: 'admin',
    role: 'admin',
  },
  {
    id: '2',
    email: 'user@example.com',
    username: 'user',
    role: 'user',
  },
];
```

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Clean up test data after each test
3. **Descriptive Names**: Use clear test names
4. **Arrange-Act-Assert**: Follow AAA pattern
5. **Mock External Dependencies**: Don't rely on external services
6. **Test Edge Cases**: Test error conditions
7. **Fast Tests**: Keep tests fast
8. **Deterministic**: Tests should always produce same result

## Debugging Tests

### Enable Debug Logging

```bash
DEBUG=* npm test
```

### Run Single Test

```bash
npm test -- -t "should create a device"
```

### Inspect Failed Tests

```bash
npm test -- --reporter=verbose
```

## Future Testing Enhancements

- [ ] Add mutation testing
- [ ] Implement contract testing
- [ ] Add security testing (OWASP)
- [ ] Implement chaos engineering
- [ ] Add visual regression testing
- [ ] Implement accessibility testing


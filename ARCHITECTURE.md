# Architecture Documentation

## System Overview

The IoT Device Manager is built using a **microservices architecture** with clear separation of concerns, following SOLID principles and industry best practices.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Angular 20 Frontend (Port 4200)              │   │
│  │  - Signals for state management                      │   │
│  │  - Zoneless change detection                         │   │
│  │  - WebSocket for real-time updates                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway (Port 3000)                 │
│  - Request routing                                           │
│  - Rate limiting                                             │
│  - Load balancing                                            │
│  - Authentication middleware                                 │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Device     │    │     User     │    │  Analytics   │
│   Service    │    │   Service    │    │   Service    │
│  (Port 3001) │    │  (Port 3004) │    │  (Port 3002) │
└──────────────┘    └──────────────┘    └──────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   MongoDB    │    │   MongoDB    │    │    Redis     │
│  (Port 27017)│    │  (Port 27017)│    │  (Port 6379) │
└──────────────┘    └──────────────┘    └──────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Notification    │
                    │    Service       │
                    │   (Port 3003)    │
                    │  - WebSocket     │
                    │  - Redis Pub/Sub │
                    └──────────────────┘
```

## Microservices Design

### 1. API Gateway

**Responsibility**: Entry point for all client requests

**Key Features**:
- Service routing and orchestration
- Rate limiting (100 requests per 15 minutes)
- Request/response logging
- Error handling middleware

**Technology Stack**:
- Express.js
- express-rate-limit
- http-proxy-middleware

**Design Patterns**:
- Gateway Pattern
- Middleware Chain Pattern

### 2. Device Service

**Responsibility**: Manage IoT device lifecycle and state

**Key Features**:
- CRUD operations for devices
- Device status management
- Pagination support
- MongoDB integration

**Technology Stack**:
- Express.js
- Mongoose ODM
- MongoDB

**Design Patterns**:
- Repository Pattern (DeviceRepository)
- Service Layer Pattern (DeviceService)
- Controller Pattern (DeviceController)
- Dependency Injection

**Data Model**:
```typescript
interface Device {
  id: string;
  name: string;
  type: 'sensor' | 'actuator' | 'gateway' | 'controller';
  status: 'online' | 'offline' | 'error';
  userId: string;
  metadata?: {
    manufacturer?: string;
    model?: string;
    firmwareVersion?: string;
  };
  configuration?: {
    reportingInterval: number;
    enabled: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  lastSeenAt?: Date;
}
```

### 3. User Service

**Responsibility**: User authentication and authorization

**Key Features**:
- User registration with password hashing (bcrypt)
- JWT-based authentication
- Role-based access control (RBAC)
- Token generation and validation

**Technology Stack**:
- Express.js
- Mongoose ODM
- bcrypt
- jsonwebtoken

**Design Patterns**:
- Repository Pattern
- Service Layer Pattern
- Strategy Pattern (authentication strategies)
- Middleware Pattern (auth middleware)

**Security Features**:
- Password hashing with salt rounds (10)
- JWT access tokens (15min expiry)
- JWT refresh tokens (7d expiry)
- Role-based permissions

### 4. Analytics Service

**Responsibility**: Device metrics collection and analytics

**Key Features**:
- Real-time metrics storage
- Time-series data management
- Redis caching with TTL
- Data aggregation

**Technology Stack**:
- Express.js
- Redis
- ioredis client

**Design Patterns**:
- Service Layer Pattern
- Cache-Aside Pattern
- Time-Series Pattern

**Caching Strategy**:
- Current metrics: 5 minutes TTL
- Metrics history: Last 100 entries per device
- Automatic expiration and cleanup

### 5. Notification Service

**Responsibility**: Real-time event broadcasting

**Key Features**:
- WebSocket server for bidirectional communication
- Redis pub/sub for inter-service messaging
- Event broadcasting to connected clients
- Connection management

**Technology Stack**:
- Express.js
- ws (WebSocket library)
- Redis pub/sub

**Design Patterns**:
- Observer Pattern (WebSocket clients)
- Pub/Sub Pattern (Redis channels)
- Singleton Pattern (WebSocket manager)

**Event Flow**:
1. Service publishes event to Redis channel
2. Notification service receives event via subscription
3. Event broadcasted to all WebSocket clients
4. Clients update UI in real-time

## SOLID Principles Implementation

### Single Responsibility Principle (SRP)
- Each service has one clear responsibility
- Controllers handle HTTP requests only
- Services contain business logic only
- Repositories handle data access only

### Open/Closed Principle (OCP)
- Services extensible through interfaces
- New device types can be added without modifying existing code
- Middleware chain allows adding new features

### Liskov Substitution Principle (LSP)
- Repository implementations can be swapped
- Service interfaces allow different implementations

### Interface Segregation Principle (ISP)
- Focused interfaces (IDeviceRepository, IUserRepository)
- Clients depend only on methods they use

### Dependency Inversion Principle (DIP)
- Services depend on abstractions (interfaces)
- Dependency injection throughout
- Configuration externalized

## Design Patterns

### Repository Pattern
```typescript
interface IDeviceRepository {
  create(data: Partial<IDevice>): Promise<IDevice>;
  findById(id: string): Promise<IDevice | null>;
  findAll(filters: DeviceFilters): Promise<IDevice[]>;
  update(id: string, data: Partial<IDevice>): Promise<IDevice>;
  delete(id: string): Promise<void>;
}
```

**Benefits**:
- Abstracts data access logic
- Testable with mock repositories
- Database-agnostic interface

### Dependency Injection
```typescript
class DeviceController {
  constructor(private deviceService: IDeviceService) {}
}

class DeviceService {
  constructor(private deviceRepository: IDeviceRepository) {}
}
```

**Benefits**:
- Loose coupling
- Easy testing with mocks
- Flexible configuration

### Observer Pattern
```typescript
class WebSocketManager {
  private clients: Map<string, WebSocket> = new Map();
  
  broadcast(data: unknown): void {
    this.clients.forEach(client => {
      client.send(JSON.stringify(data));
    });
  }
}
```

**Benefits**:
- Decoupled event handling
- Multiple subscribers
- Real-time updates

## Data Flow

### Device Creation Flow
1. Client sends POST request to API Gateway
2. Gateway routes to Device Service
3. Device Service validates input (Zod schema)
4. Repository creates device in MongoDB
5. Service publishes event to Redis
6. Notification service broadcasts to WebSocket clients
7. Response returned to client

### Real-time Metrics Flow
1. Device simulator sends metrics to Analytics Service
2. Analytics Service stores in Redis with TTL
3. Service publishes event to Redis channel
4. Notification Service receives event
5. Event broadcasted to WebSocket clients
6. Frontend updates dashboard in real-time

## Security Architecture

### Authentication Flow
1. User submits credentials
2. User Service validates and hashes password
3. JWT tokens generated (access + refresh)
4. Tokens returned to client
5. Client includes access token in subsequent requests
6. API Gateway validates token
7. User ID passed to downstream services

### Authorization
- Role-based access control (RBAC)
- Roles: `user`, `admin`
- Middleware checks user role before allowing access
- Resource-level permissions

## Scalability Considerations

### Horizontal Scaling
- Stateless services (except WebSocket connections)
- Load balancer in front of API Gateway
- Multiple instances of each service
- Shared MongoDB and Redis instances

### Caching Strategy
- Redis for frequently accessed data
- TTL-based expiration
- Cache invalidation on updates
- Read-through cache pattern

### Database Optimization
- MongoDB indexes on frequently queried fields
- Connection pooling (10 max, 5 min)
- Aggregation pipelines for analytics
- Sharding ready

## Monitoring & Observability

### Logging
- Structured logging with context
- Log levels: info, warn, error
- Correlation IDs for request tracing
- Centralized log aggregation ready

### Health Checks
- `/health` endpoint on each service
- Database connection status
- Redis connection status
- Service uptime

## Technology Choices Rationale

### Node.js 24
- Latest LTS with performance improvements
- V8 12.4+ with better optimization
- Native TypeScript support improvements
- Modern ECMAScript features

### TypeScript 5
- Strict type safety
- Better IDE support
- Compile-time error detection
- Improved developer experience

### MongoDB
- Flexible schema for IoT devices
- Horizontal scaling support
- Rich query capabilities
- Document-oriented fits device metadata

### Redis
- In-memory performance for metrics
- Pub/sub for real-time events
- TTL support for automatic cleanup
- Simple data structures

### Angular 20
- Signals for reactive state
- Zoneless for better performance
- Standalone components (modern)
- Strong TypeScript integration

## Future Enhancements

1. **Message Queue**: Add RabbitMQ/Kafka for event streaming
2. **API Versioning**: Support multiple API versions
3. **GraphQL**: Alternative API interface
4. **Kubernetes**: Container orchestration
5. **Monitoring**: Prometheus + Grafana
6. **Tracing**: OpenTelemetry integration
7. **Testing**: Comprehensive test coverage
8. **CI/CD**: Automated deployment pipeline
9. **Documentation**: OpenAPI/Swagger specs
10. **Performance**: Caching improvements, query optimization


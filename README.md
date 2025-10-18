# IoT Device Manager

A comprehensive IoT device management system built with modern technologies and best practices, demonstrating microservices architecture, real-time communication, and full-stack development expertise.

## 🚀 Technology Stack

### Backend
- **Node.js 24** (LTS) - Latest features with V8 12.4+, npm 11
- **TypeScript 5** - Strict type safety and latest features
- **Express.js** - Web framework for microservices
- **MongoDB** - Primary database with Mongoose ODM
- **Redis** - Caching layer and pub/sub for real-time events
- **WebSocket (ws)** - Real-time bidirectional communication
- **JWT** - Token-based authentication
- **Zod** - Runtime type validation

### Frontend
- **Angular 20** - Latest version with Signals and zoneless change detection
- **TypeScript 5** - Type-safe frontend development
- **RxJS** - Reactive programming
- **SCSS** - Styling with variables and nesting

### DevOps & Tools
- **Docker Compose** - Local development environment
- **ESLint & Prettier** - Code quality and formatting
- **npm Workspaces** - Monorepo management

## 🏗️ Architecture

### Microservices

The system follows a **microservices architecture** with clear separation of concerns:

1. **API Gateway** (Port 3000)
   - Entry point for all client requests
   - Request routing and load balancing
   - Rate limiting and security
   - Service orchestration

2. **Device Service** (Port 3001)
   - Device CRUD operations
   - Device status management
   - MongoDB integration
   - Repository pattern implementation

3. **User Service** (Port 3004)
   - User authentication (JWT)
   - Authorization (RBAC)
   - Password hashing with bcrypt
   - User profile management

4. **Analytics Service** (Port 3002)
   - Device metrics collection
   - Redis caching with TTL
   - Time-series data storage
   - Data aggregation

5. **Notification Service** (Port 3003)
   - WebSocket server for real-time updates
   - Redis pub/sub for event broadcasting
   - Observer pattern implementation
   - Real-time device status notifications

### Design Patterns & Principles

#### SOLID Principles
- **Single Responsibility**: Each class/module has one clear purpose
- **Open/Closed**: Extensible through interfaces without modification
- **Liskov Substitution**: Proper inheritance hierarchies
- **Interface Segregation**: Focused, minimal interfaces
- **Dependency Inversion**: Depend on abstractions, not concretions

#### Design Patterns
- **Repository Pattern**: Data access abstraction
- **Dependency Injection**: Loose coupling between components
- **Observer Pattern**: WebSocket event broadcasting
- **Factory Pattern**: Object creation abstraction
- **Singleton Pattern**: Shared service instances

#### Best Practices
- **DRY (Don't Repeat Yourself)**: Shared utilities and constants
- **Clean Architecture**: Layered design with clear boundaries
- **Type Safety**: Comprehensive TypeScript usage
- **Error Handling**: Centralized error management
- **Security**: JWT authentication, input validation, rate limiting
- **Performance**: Redis caching, connection pooling, lazy loading
- **Scalability**: Horizontal scaling ready
- **Maintainability**: Clear naming, documentation, consistent patterns

## 📁 Project Structure

```
iot-device-manager/
├── packages/
│   ├── shared/                 # Shared utilities and types
│   │   ├── src/
│   │   │   ├── types/         # TypeScript interfaces
│   │   │   ├── utils/         # Utility functions
│   │   │   ├── constants/     # Application constants
│   │   │   └── validators/    # Zod validation schemas
│   │   └── package.json
│   │
│   ├── api-gateway/           # API Gateway Service
│   │   ├── src/
│   │   │   ├── routes/        # Route definitions
│   │   │   ├── middleware/    # Express middleware
│   │   │   ├── config/        # Configuration
│   │   │   └── server.ts      # Server entry point
│   │   └── package.json
│   │
│   ├── device-service/        # Device Management Service
│   │   ├── src/
│   │   │   ├── controllers/   # Request handlers
│   │   │   ├── services/      # Business logic
│   │   │   ├── repositories/  # Data access layer
│   │   │   ├── models/        # Mongoose models
│   │   │   └── server.ts
│   │   └── package.json
│   │
│   ├── user-service/          # User & Auth Service
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── models/
│   │   │   ├── middleware/    # Auth middleware
│   │   │   └── server.ts
│   │   └── package.json
│   │
│   ├── analytics-service/     # Analytics Service
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── config/        # Redis configuration
│   │   │   └── server.ts
│   │   └── package.json
│   │
│   ├── notification-service/  # Notification Service
│   │   ├── src/
│   │   │   ├── services/      # Pub/sub service
│   │   │   ├── websocket/     # WebSocket manager
│   │   │   └── server.ts
│   │   └── package.json
│   │
│   └── frontend/              # Angular 20 Frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── core/      # Core services
│       │   │   ├── features/  # Feature modules
│       │   │   └── shared/    # Shared components
│       │   └── environments/
│       └── package.json
│
├── tools/
│   └── device-simulator/      # IoT Device Simulator
│       └── src/
│
├── docker-compose.yml         # Development environment
├── package.json               # Root package.json
├── tsconfig.json              # Base TypeScript config
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- **Node.js 24+** (LTS)
- **npm 11+**
- **Docker & Docker Compose** (for MongoDB and Redis)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/waqas1412/iot-device-manager.git
   cd iot-device-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start Docker services**
   ```bash
   npm run docker:up
   ```

   This starts:
   - MongoDB (port 27017)
   - Redis (port 6379)
   - Mongo Express (port 8081) - Database UI
   - Redis Commander (port 8082) - Redis UI

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Build shared package**
   ```bash
   cd packages/shared
   npm run build
   cd ../..
   ```

### Running the Services

#### Development Mode (All Services)

```bash
# Terminal 1: API Gateway
npm run dev:gateway

# Terminal 2: Device Service
npm run dev:device

# Terminal 3: User Service
npm run dev:user

# Terminal 4: Analytics Service
npm run dev:analytics

# Terminal 5: Notification Service
npm run dev:notification

# Terminal 6: Frontend
npm run dev:frontend
```

#### Individual Services

```bash
# API Gateway
cd packages/api-gateway
npm run dev

# Device Service
cd packages/device-service
npm run dev

# User Service
cd packages/user-service
npm run dev

# Analytics Service
cd packages/analytics-service
npm run dev

# Notification Service
cd packages/notification-service
npm run dev

# Frontend
cd packages/frontend
npm start
```

### Running the Device Simulator

```bash
cd tools/device-simulator
npm run dev
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile

### Devices
- `GET /api/devices` - List all devices (paginated)
- `POST /api/devices` - Create new device
- `GET /api/devices/:id` - Get device by ID
- `PUT /api/devices/:id` - Update device
- `DELETE /api/devices/:id` - Delete device
- `PATCH /api/devices/:id/status` - Update device status

### Analytics
- `POST /api/analytics/devices/:deviceId/metrics` - Store device metrics
- `GET /api/analytics/devices/:deviceId/metrics` - Get current metrics
- `GET /api/analytics/devices/:deviceId/metrics/history` - Get metrics history
- `GET /api/analytics/devices/:deviceId/stats` - Get aggregated statistics

### Notifications
- `POST /api/notifications/send` - Send notification
- `POST /api/events/device` - Publish device event

### WebSocket
- Connect to `ws://localhost:3003` for real-time updates
- Events: `device:status:changed`, `device:metrics:updated`, `notification:sent`

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests for specific package
cd packages/device-service
npm test
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Zod schemas for runtime validation
- **Rate Limiting**: Prevent abuse and DoS attacks
- **CORS**: Configured for security
- **Helmet**: Security headers
- **RBAC**: Role-based access control

## 📊 Database Schema

### MongoDB Collections

**users**
- id, email, username, password (hashed), role, profile, timestamps

**devices**
- id, name, type, status, userId, metadata, configuration, timestamps

### Redis Keys

- `device:metrics:{deviceId}` - Current device metrics
- `device:metrics:history:{deviceId}` - Metrics history (list)
- `user:session:{userId}` - User sessions

### Redis Pub/Sub Channels

- `device:events` - Device-related events
- `notifications` - System notifications

## 🎨 Frontend Features

- **Angular 20 Signals**: Reactive state management
- **Zoneless Change Detection**: Better performance
- **Standalone Components**: Modern Angular architecture
- **Lazy Loading**: Route-based code splitting
- **Real-time Updates**: WebSocket integration
- **Responsive Design**: Mobile-first approach
- **Beautiful UI**: Modern, clean interface

## 🛠️ Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **tsx**: Fast TypeScript execution
- **Concurrently**: Run multiple commands

## 📝 Environment Variables

```env
# Database
MONGODB_URI=mongodb://admin:password123@localhost:27017/iot-device-manager?authSource=admin
REDIS_URI=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Service Ports
API_GATEWAY_PORT=3000
DEVICE_SERVICE_PORT=3001
ANALYTICS_SERVICE_PORT=3002
NOTIFICATION_SERVICE_PORT=3003
USER_SERVICE_PORT=3004

# Environment
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:4200
```

## 🚀 Deployment

### Production Build

```bash
# Build all services
npm run build

# Start production servers
npm start
```

### 🐳 Docker Deployment (Recommended)

**Single Command Deployment** - Start the entire system with one command:

```bash
docker-compose up --build
```

This will:
- ✅ Build all Docker images
- ✅ Start 12 containers (5 microservices + MongoDB + Redis + Frontend + Management UIs + Seed + Simulator)
- ✅ Seed database with 2 users and 45 devices
- ✅ Start device simulator for real-time updates
- ✅ Configure networking automatically

**Access Points:**
- Frontend: http://localhost:4200
- API Gateway: http://localhost:3000
- Swagger Docs: http://localhost:3000/api-docs
- MongoDB Express: http://localhost:8081 (admin/password123)
- Redis Commander: http://localhost:8082

**Login Credentials:**
- Admin: `admin@iot.com` / `Admin@123`
- User: `user@iot.com` / `User@123`

**Pre-seeded Data:**
- 2 users (admin and regular user)
- 45 IoT devices with realistic data
- Various device types: temperature, humidity, actuator, gateway, controller
- Device statuses: online, offline, error
- Real-time simulator updates every 5 seconds

## 📚 Key Learning Demonstrations

This project showcases:

1. **Microservices Architecture**: Independent, scalable services
2. **SOLID Principles**: Throughout the codebase
3. **Design Patterns**: Repository, DI, Observer, Factory
4. **TypeScript 5**: Advanced types, decorators, strict mode
5. **Node.js 24**: Latest features and best practices
6. **Angular 20**: Signals, zoneless, standalone components
7. **MongoDB**: Schema design, indexing, aggregation
8. **Redis**: Caching, pub/sub, time-series data
9. **WebSocket**: Real-time bidirectional communication
10. **Security**: Authentication, authorization, validation
11. **Testing**: Unit, integration, E2E tests
12. **DevOps**: Docker, environment management
13. **Clean Code**: Readable, maintainable, documented
14. **Problem Solving**: Real-world IoT challenges

## 📄 License

MIT

## 👤 Author

**waqas1412**

---

**Built with ❤️ using Node.js 24, Angular 20, TypeScript 5, MongoDB, and Redis**


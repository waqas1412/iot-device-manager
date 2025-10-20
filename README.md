# IoT Device Manager

<div align="center">

![IoT Device Manager](https://img.shields.io/badge/IoT-Device%20Manager-blue?style=for-the-badge&logo=iot&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-24-green?style=for-the-badge&logo=node.js&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-20-red?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Cache-red?style=for-the-badge&logo=redis&logoColor=white)

**A comprehensive IoT device management system built with modern technologies and best practices, demonstrating microservices architecture, real-time communication, and full-stack development expertise.**

[![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge)](CONTRIBUTING.md)

</div>

---

## 🗺️ Table of Contents

- [📦 Quick Start](#-quick-start)
- [🏗️ Architecture](#️-architecture)
- [🚀 Technology Stack](#-technology-stack)
- [🎮 Features](#-features)
- [📡 API Endpoints](#-api-endpoints)
- [🛠️ Development](#️-development)
- [🐳 Docker Deployment](#-docker-deployment)
- [🔒 Security](#-security)
- [📊 Database Schema](#-database-schema)
- [🧪 Testing](#-testing)
- [📚 Documentation](#-documentation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 📦 Quick Start

### Prerequisites

- **Docker & Docker Compose** (Recommended)
- **Node.js 24+** (LTS)
- **npm 11+**
- **8GB RAM minimum**

### 🚀 One-Command Setup

```bash
# Clone the repository
git clone https://github.com/waqas1412/iot-device-manager.git
cd iot-device-manager

# Start everything with Docker
docker-compose up --build
```

**That's it!** 🎉 The system will automatically:
- ✅ Start MongoDB and Redis
- ✅ Build and start all 5 microservices
- ✅ Build and start Angular frontend
- ✅ Seed database with 45 devices and 3 users
- ✅ Start device simulator for real-time data
- ✅ Start management UIs

### 🌐 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:4200 | Angular 20 Dashboard |
| **API Gateway** | http://localhost:3000 | Main API Entry Point |
| **Swagger Docs** | http://localhost:3000/api-docs | API Documentation |
| **Mongo Express** | http://localhost:8081 | Database UI |
| **Redis Commander** | http://localhost:8082 | Cache UI |

### 🔑 Login Credentials

| Email | Password | Role |
|-------|----------|------|
| `admin@iot.com` | `Admin@123` | admin |
| `user@iot.com` | `User@123` | user |

---

## 🏗️ Architecture

### Microservices Design

```mermaid
graph TB
    subgraph "Client Layer"
        A[Angular 20 Frontend<br/>Port 4200]
    end
    
    subgraph "API Gateway"
        B[API Gateway<br/>Port 3000]
    end
    
    subgraph "Microservices"
        C[Device Service<br/>Port 3001]
        D[User Service<br/>Port 3004]
        E[Analytics Service<br/>Port 3002]
        F[Notification Service<br/>Port 3003]
    end
    
    subgraph "Data Layer"
        G[MongoDB<br/>Port 27017]
        H[Redis<br/>Port 6379]
    end
    
    A --> B
    B --> C
    B --> D
    B --> E
    B --> F
    C --> G
    D --> G
    E --> H
    F --> H
    F --> A
```

### 🎯 Service Responsibilities

| Service | Port | Responsibility | Technology |
|---------|------|----------------|------------|
| **API Gateway** | 3000 | Request routing, rate limiting, authentication | Express.js |
| **Device Service** | 3001 | Device CRUD, status management | MongoDB, Mongoose |
| **Analytics Service** | 3002 | Metrics collection, time-series data | Redis, ioredis |
| **Notification Service** | 3003 | Real-time updates, WebSocket | ws, Redis pub/sub |
| **User Service** | 3004 | Authentication, authorization | JWT, bcrypt |

---

## 🚀 Technology Stack

### Backend Technologies

$${\color{#AC3097}Node.js \space \color{#56565E}24 \space (LTS)}$$

- **Latest LTS** with V8 12.4+ performance improvements
- **Native TypeScript** support enhancements
- **Modern ECMAScript** features

$${\color{#AC3097}TypeScript \space \color{#56565E}5}$$

- **Strict type safety** with advanced types
- **Compile-time error** detection
- **Enhanced IDE** support and developer experience

$${\color{#AC3097}Express.js \space \color{#56565E}Framework}$$

- **Web framework** for microservices
- **Middleware chain** pattern
- **RESTful API** design

### Database & Caching

$${\color{#AC3097}MongoDB \space \color{#56565E}Database}$$

- **Document-oriented** database for flexible IoT device schemas
- **Horizontal scaling** support
- **Rich query** capabilities with aggregation pipelines

$${\color{#AC3097}Redis \space \color{#56565E}Cache}$$

- **In-memory** performance for real-time metrics
- **Pub/Sub** for inter-service communication
- **TTL support** for automatic data expiration

### Frontend Technologies

$${\color{#AC3097}Angular \space \color{#56565E}20}$$

- **Signals** for reactive state management
- **Zoneless change detection** for better performance
- **Standalone components** (modern architecture)
- **Strong TypeScript** integration

### DevOps & Tools

$${\color{#AC3097}Docker \space \color{#56565E}Containerization}$$

- **Multi-stage builds** for optimized images
- **Docker Compose** for local development
- **Health checks** and service dependencies

$${\color{#AC3097}Development \space \color{#56565E}Tools}$$

- **ESLint & Prettier** for code quality
- **npm Workspaces** for monorepo management
- **tsx** for fast TypeScript execution

---

## 🎮 Features

### 🔧 Device Management

$${\color{#AC3097}Device \space \color{#56565E}CRUD \space Operations}$$

- **Create** new IoT devices with metadata
- **Read** device information with pagination
- **Update** device configuration and status
- **Delete** devices with proper cleanup

$${\color{#AC3097}Device \space \color{#56565E}Types}$$

- **Sensors**: Temperature, humidity, pressure
- **Actuators**: Smart switches, motors, valves
- **Gateways**: IoT communication hubs
- **Controllers**: Device management units

### 📊 Real-time Analytics

$${\color{#AC3097}Metrics \space \color{#56565E}Collection}$$

- **Real-time** device metrics storage
- **Time-series** data with Redis TTL
- **Data aggregation** and statistics
- **Historical** metrics tracking

$${\color{#AC3097}Live \space \color{#56565E}Updates}$$

- **WebSocket** connections for real-time data
- **Redis pub/sub** for event broadcasting
- **Automatic** UI updates without refresh

### 🔐 Authentication & Security

$${\color{#AC3097}JWT \space \color{#56565E}Authentication}$$

- **Token-based** authentication system
- **Access tokens** (15min expiry)
- **Refresh tokens** (7d expiry)
- **Role-based** access control (RBAC)

$${\color{#AC3097}Security \space \color{#56565E}Features}$$

- **Password hashing** with bcrypt
- **Input validation** with Zod schemas
- **Rate limiting** (100 req/15min)
- **CORS** configuration
- **Security headers** with Helmet

### 🎨 Modern Frontend

$${\color{#AC3097}Angular \space \color{#56565E}20 \space Features}$$

- **Signals** for reactive state management
- **Zoneless** change detection
- **Standalone** components
- **Lazy loading** routes
- **Responsive** design

$${\color{#AC3097}User \space \color{#56565E}Experience}$$

- **Beautiful** modern UI
- **Real-time** updates
- **Mobile-first** responsive design
- **Intuitive** navigation

---

## 📡 API Endpoints

### 🔐 Authentication

$${\color{#AC3097}User \space \color{#56565E}Authentication}$$

```bash
POST /api/auth/register    # Register new user
POST /api/auth/login       # Login user
GET  /api/auth/profile     # Get current user profile
POST /api/auth/refresh     # Refresh access token
```

### 📱 Device Management

$${\color{#AC3097}Device \space \color{#56565E}Operations}$$

```bash
GET    /api/devices              # List all devices (paginated)
POST   /api/devices              # Create new device
GET    /api/devices/:id          # Get device by ID
PUT    /api/devices/:id          # Update device
DELETE /api/devices/:id          # Delete device
PATCH  /api/devices/:id/status   # Update device status
```

### 📊 Analytics

$${\color{#AC3097}Metrics \space \color{#56565E}Management}$$

```bash
POST /api/analytics/devices/:deviceId/metrics        # Store device metrics
GET  /api/analytics/devices/:deviceId/metrics        # Get current metrics
GET  /api/analytics/devices/:deviceId/metrics/history # Get metrics history
GET  /api/analytics/devices/:deviceId/stats          # Get aggregated statistics
```

### 🔔 Notifications

$${\color{#AC3097}Real-time \space \color{#56565E}Events}$$

```bash
POST /api/notifications/send  # Send notification
POST /api/events/device       # Publish device event
```

### 🌐 WebSocket

$${\color{#AC3097}Real-time \space \color{#56565E}Connection}$$

- **Connect**: `ws://localhost:3003`
- **Events**: 
  - `device:status:changed`
  - `device:metrics:updated`
  - `notification:sent`

---

## 🛠️ Development

### 📋 Prerequisites

- **Node.js 24+** (LTS)
- **npm 11+**
- **Docker & Docker Compose** (for databases)

### 🚀 Local Development Setup

$${\color{#AC3097}Install \space \color{#56565E}Dependencies}$$

   ```bash
# Clone repository
   git clone https://github.com/waqas1412/iot-device-manager.git
   cd iot-device-manager

# Install all dependencies
   npm install
   ```

$${\color{#AC3097}Start \space \color{#56565E}Infrastructure}$$

   ```bash
# Start MongoDB and Redis
   npm run docker:up
   ```

$${\color{#AC3097}Build \space \color{#56565E}Shared \space Package}$$

   ```bash
# Build shared utilities
npm run build:shared
```

### 🎮 Running Services

$${\color{#AC3097}Development \space \color{#56565E}Mode}$$

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

$${\color{#AC3097}Individual \space \color{#56565E}Services}$$

```bash
# API Gateway
cd packages/api-gateway && npm run dev

# Device Service
cd packages/device-service && npm run dev

# User Service
cd packages/user-service && npm run dev

# Analytics Service
cd packages/analytics-service && npm run dev

# Notification Service
cd packages/notification-service && npm run dev

# Frontend
cd packages/frontend && npm start
```

### 🎯 Device Simulator

$${\color{#AC3097}Run \space \color{#56565E}Simulator}$$

```bash
# Start device simulator
npm run dev:simulator
```

---

## 🐳 Docker Deployment

### 🚀 Production Deployment

$${\color{#AC3097}Single \space \color{#56565E}Command \space Deployment}$$

```bash
docker-compose up --build
```

**This will:**
- ✅ Build all Docker images
- ✅ Start 12 containers (5 microservices + MongoDB + Redis + Frontend + Management UIs + Seed + Simulator)
- ✅ Seed database with 2 users and 45 devices
- ✅ Start device simulator for real-time updates
- ✅ Configure networking automatically

### 📊 What's Running

After `docker-compose up`, you'll have:

- **9 containers** running simultaneously
- **MongoDB** with 45 devices and 3 users
- **Redis** caching real-time metrics
- **5 microservices** communicating via REST and pub/sub
- **Angular frontend** with real-time WebSocket updates
- **Device simulator** generating live data every 5 seconds

### 🎯 Pre-seeded Data

- **2 users** (admin and regular user)
- **45 IoT devices** with realistic data
- **Various device types**: temperature, humidity, actuator, gateway, controller
- **Device statuses**: online, offline, error
- **Real-time simulator** updates every 5 seconds

### 🛑 Stop the System

$${\color{#AC3097}Stop \space \color{#56565E}Services}$$

```bash
# Stop all services
docker-compose down

# Stop and remove all data
docker-compose down -v
```

$${\color{#AC3097}View \space \color{#56565E}Logs}$$

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api-gateway
docker-compose logs -f device-service
docker-compose logs -f frontend
```

---

## 🔒 Security

### 🛡️ Security Features

$${\color{#AC3097}Authentication \space \color{#56565E}Security}$$

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds (10)
- **Token Expiry**: Access tokens (15min), Refresh tokens (7d)
- **Role-based Access Control**: Admin and user roles

$${\color{#AC3097}API \space \color{#56565E}Security}$$

- **Rate Limiting**: 100 requests per 15 minutes
- **Input Validation**: Zod schemas for runtime validation
- **CORS**: Configured for security
- **Helmet**: Security headers
- **Request Logging**: Comprehensive audit trail

### 🔐 Environment Variables

$${\color{#AC3097}Security \space \color{#56565E}Configuration}$$

```env
# Database
MONGODB_URI=mongodb://admin:password123@localhost:27017/iot-device-manager?authSource=admin
REDIS_URI=redis://localhost:6379

# JWT Secrets (Change in production!)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-characters-long

# Service Ports
API_GATEWAY_PORT=3000
DEVICE_SERVICE_PORT=3001
ANALYTICS_SERVICE_PORT=3002
NOTIFICATION_SERVICE_PORT=3003
USER_SERVICE_PORT=3004

# Environment
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200
```

---

## 📊 Database Schema

### 🗄️ MongoDB Collections

$${\color{#AC3097}Users \space \color{#56565E}Collection}$$

```typescript
interface User {
  id: string;
  email: string;
  username: string;
  password: string; // hashed
  role: 'user' | 'admin';
  profile: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

$${\color{#AC3097}Devices \space \color{#56565E}Collection}$$

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

### 🔴 Redis Keys

$${\color{#AC3097}Cache \space \color{#56565E}Structure}$$

- `device:metrics:{deviceId}` - Current device metrics (5min TTL)
- `device:metrics:history:{deviceId}` - Metrics history (list, 100 entries)
- `user:session:{userId}` - User sessions
- `analytics:stats:{deviceId}` - Aggregated statistics

### 📡 Redis Pub/Sub Channels

$${\color{#AC3097}Event \space \color{#56565E}Channels}$$

- `device:events` - Device-related events
- `notifications` - System notifications
- `analytics:updates` - Analytics data updates

---

## 🧪 Testing

### 🎯 Test Commands

$${\color{#AC3097}Run \space \color{#56565E}Tests}$$

```bash
# Run all tests
npm test

# Run tests for specific package
cd packages/device-service
npm test

# Run tests with coverage
npm run test:coverage
```

### 📋 Test Coverage

- **Unit Tests**: Individual service testing
- **Integration Tests**: Service communication testing
- **E2E Tests**: Full application flow testing
- **API Tests**: Endpoint validation testing

---

## 📚 Documentation

### 📖 Additional Resources

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Detailed system architecture
- **[QUICKSTART.md](QUICKSTART.md)** - Quick start guide
- **[docs/API.md](docs/API.md)** - Complete API reference
- **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Production deployment guide
- **[docs/TESTING.md](docs/TESTING.md)** - Testing strategies
- **[docs/SWAGGER.md](docs/SWAGGER.md)** - API documentation

### 🎯 Key Learning Demonstrations

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

---

## 🤝 Contributing

### 🚀 How to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### 📋 Development Guidelines

- Follow **TypeScript** best practices
- Write **comprehensive tests**
- Update **documentation**
- Follow **conventional commits**
- Ensure **code quality** with ESLint/Prettier

### 🐛 Bug Reports

Please use the [GitHub Issues](https://github.com/waqas1412/iot-device-manager/issues) to report bugs.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**waqas1412**

<div align="center">

**Built with ❤️ using Node.js 24, Angular 20, TypeScript 5, MongoDB, and Redis**

[![GitHub](https://img.shields.io/badge/GitHub-waqas1412-black?style=for-the-badge&logo=github)](https://github.com/waqas1412)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/waqas1412)

---

⭐ **Star this repository if you found it helpful!**

</div>
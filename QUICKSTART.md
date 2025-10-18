# Quick Start Guide

## 🚀 Run Everything with One Command

### Prerequisites
- Docker installed
- Docker Compose installed
- 8GB RAM minimum
- Ports available: 3000-3004, 4200, 6379, 8081-8082, 27017

### Start the Entire System

```bash
docker-compose up --build
```

That's it! This single command will:

1. ✅ Start MongoDB and Redis
2. ✅ Build and start all 5 microservices
3. ✅ Build and start Angular frontend
4. ✅ Seed database with 45 devices and 3 users
5. ✅ Start device simulator for real-time data
6. ✅ Start management UIs

### Access the Application

**Main Application:**
- Frontend: http://localhost:4200
- API Gateway: http://localhost:3000

**Management UIs:**
- Mongo Express: http://localhost:8081
- Redis Commander: http://localhost:8082

**Individual Services:**
- Device Service: http://localhost:3001
- Analytics Service: http://localhost:3002
- Notification Service: http://localhost:3003
- User Service: http://localhost:3004

### Login Credentials

The database is pre-seeded with these users:

| Email | Password | Role |
|-------|----------|------|
| admin@iot.com | admin123 | admin |
| user@iot.com | user123 | user |
| demo@iot.com | demo123 | user |

### What You'll See

1. **Dashboard** with 45 pre-loaded devices:
   - 15 Temperature Sensors
   - 10 Humidity Sensors
   - 8 Smart Actuators
   - 5 IoT Gateways
   - 7 Controllers

2. **Real-time Updates** from the device simulator:
   - Metrics updating every 5 seconds
   - Device status changes
   - Live WebSocket notifications

3. **Full CRUD Operations**:
   - Create new devices
   - Update device configuration
   - Change device status
   - Delete devices

### Stop the System

```bash
docker-compose down
```

### Stop and Remove All Data

```bash
docker-compose down -v
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api-gateway
docker-compose logs -f device-service
docker-compose logs -f frontend
```

### Rebuild After Changes

```bash
docker-compose up --build --force-recreate
```

## 📊 What's Running

After `docker-compose up`, you'll have:

- **9 containers** running simultaneously
- **MongoDB** with 45 devices and 3 users
- **Redis** caching real-time metrics
- **5 microservices** communicating via REST and pub/sub
- **Angular frontend** with real-time WebSocket updates
- **Device simulator** generating live data every 5 seconds

## 🎯 Try These Features

1. **Login** with admin@iot.com / admin123
2. **View Dashboard** - See all 45 devices
3. **Watch Real-time Updates** - Metrics update every 5 seconds
4. **Create a Device** - Add your own device
5. **Update Device Status** - Change online/offline/error
6. **View Analytics** - See device metrics and history
7. **Check MongoDB** - Browse data at http://localhost:8081
8. **Check Redis** - View cache at http://localhost:8082

## 🐛 Troubleshooting

### Ports Already in Use

```bash
# Check what's using the port
lsof -i :4200
lsof -i :3000

# Kill the process or change ports in docker-compose.yml
```

### Services Not Starting

```bash
# Check logs
docker-compose logs

# Restart specific service
docker-compose restart device-service
```

### Database Not Seeded

```bash
# Manually run seed script
docker-compose run --rm db-seed
```

### Out of Memory

```bash
# Increase Docker memory limit to 8GB
# Docker Desktop -> Settings -> Resources -> Memory
```

## 📖 Next Steps

- Read [README.md](README.md) for detailed documentation
- Check [ARCHITECTURE.md](ARCHITECTURE.md) for system design
- Review [API.md](docs/API.md) for API reference
- See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for production deployment

## 💡 Tips

- The device simulator runs continuously, generating realistic IoT data
- All data persists in Docker volumes (mongodb_data, redis_data)
- WebSocket connection shows real-time device updates
- Use Mongo Express to browse the database structure
- Use Redis Commander to see cached metrics

## 🎉 Enjoy!

You now have a fully functional IoT Device Management System running locally with real-time data simulation!


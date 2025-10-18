# Windows Setup Guide

## Quick Start on Windows

### Prerequisites

1. **Docker Desktop for Windows** installed and running
2. **Git** installed
3. **8GB RAM** minimum allocated to Docker
4. **WSL 2** enabled (recommended)

### Step-by-Step Setup

#### 1. Clone the Repository

```powershell
git clone https://github.com/waqas1412/iot-device-manager.git
cd iot-device-manager
```

#### 2. Start Infrastructure Only (Recommended First)

Start MongoDB and Redis first to ensure they're healthy:

```powershell
docker-compose up -d mongodb redis
```

Wait for about 30 seconds, then verify:

```powershell
docker-compose ps
```

Both should show "healthy" status.

#### 3. Start Management UIs

```powershell
docker-compose up -d mongo-express redis-commander
```

#### 4. Build and Start Services

Now build and start all microservices:

```powershell
docker-compose up --build -d user-service device-service analytics-service notification-service api-gateway
```

This will take 5-10 minutes on first build.

#### 5. Start Frontend

```powershell
docker-compose up --build -d frontend
```

#### 6. Seed the Database

Wait for all services to be running, then seed the database:

```powershell
docker-compose run --rm db-seed
```

### Alternative: One Command (May Take Longer)

If you prefer, you can start everything at once:

```powershell
docker-compose up --build
```

**Note**: This may take 10-15 minutes on first run and might show some connection errors initially as services wait for dependencies. This is normal.

### Access the Application

Once all containers are running:

- **Frontend**: http://localhost:4200
- **API Gateway**: http://localhost:3000
- **Swagger API Docs**: http://localhost:3000/api-docs
- **Mongo Express**: http://localhost:8081
- **Redis Commander**: http://localhost:8082

### Login Credentials

```
Email: admin@iot.com
Password: admin123
```

### Troubleshooting

#### Build Fails with "npm ci" Error

This has been fixed. If you still see it, pull the latest changes:

```powershell
git pull origin main
```

#### Services Not Starting

Check Docker Desktop has enough resources:
- Open Docker Desktop
- Go to Settings → Resources
- Allocate at least 8GB RAM
- Allocate at least 4 CPU cores

#### Port Already in Use

Check if ports are available:

```powershell
netstat -ano | findstr :3000
netstat -ano | findstr :4200
netstat -ano | findstr :27017
```

If ports are in use, either:
1. Stop the conflicting application
2. Change ports in `docker-compose.yml`

#### Database Not Seeded

Manually run the seed script:

```powershell
docker-compose run --rm db-seed
```

#### View Logs

To see what's happening:

```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api-gateway
docker-compose logs -f device-service
docker-compose logs -f mongodb
```

#### Clean Start

If you want to start fresh:

```powershell
# Stop all containers
docker-compose down

# Remove volumes (deletes all data)
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Start fresh
docker-compose up --build
```

### Windows-Specific Issues

#### Line Ending Issues

If you get errors about line endings (CRLF vs LF), configure Git:

```powershell
git config --global core.autocrlf false
git clone https://github.com/waqas1412/iot-device-manager.git
```

#### WSL 2 Performance

For better performance, enable WSL 2 backend in Docker Desktop:
1. Open Docker Desktop
2. Go to Settings → General
3. Enable "Use WSL 2 based engine"
4. Apply & Restart

#### Firewall Issues

If containers can't communicate:
1. Open Windows Defender Firewall
2. Allow Docker Desktop through firewall
3. Restart Docker Desktop

### Development on Windows

#### Using PowerShell

All commands work in PowerShell. For better experience:

```powershell
# Install Docker completion
Install-Module DockerCompletion -Scope CurrentUser
Import-Module DockerCompletion
```

#### Using WSL 2

For best performance, work inside WSL 2:

```bash
# In WSL 2 terminal
cd /mnt/c/Projects/iot-device-manager
docker-compose up --build
```

### Stopping the Application

```powershell
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Next Steps

Once everything is running:

1. Open http://localhost:4200
2. Login with admin@iot.com / admin123
3. Explore the 45 pre-seeded devices
4. Watch real-time updates
5. Try the Swagger API docs at http://localhost:3000/api-docs

### Getting Help

If you encounter issues:

1. Check the logs: `docker-compose logs -f`
2. Verify Docker Desktop is running
3. Ensure ports are not in use
4. Check Docker has enough resources
5. Try a clean start: `docker-compose down -v && docker-compose up --build`

### Performance Tips

1. **Allocate More Resources**: Give Docker Desktop more RAM and CPU
2. **Use WSL 2**: Better performance than Hyper-V
3. **Close Other Applications**: Free up system resources
4. **SSD Recommended**: Faster build times
5. **Disable Antivirus Scanning**: For Docker directories (if safe)

### Common Windows Commands

```powershell
# Check Docker version
docker --version
docker-compose --version

# List running containers
docker ps

# Stop specific container
docker stop iot-api-gateway

# Restart specific service
docker-compose restart device-service

# View container logs
docker logs iot-mongodb

# Enter container shell
docker exec -it iot-mongodb bash

# Check disk usage
docker system df

# Clean up unused resources
docker system prune
```

### Success Indicators

You'll know everything is working when:

1. ✅ All containers show "Up" status: `docker-compose ps`
2. ✅ Frontend loads at http://localhost:4200
3. ✅ You can login with admin@iot.com
4. ✅ Dashboard shows 45 devices
5. ✅ Swagger UI works at http://localhost:3000/api-docs
6. ✅ Mongo Express shows data at http://localhost:8081

Enjoy your IoT Device Manager! 🚀


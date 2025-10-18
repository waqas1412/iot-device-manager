# Deployment Guide

## Prerequisites

- Node.js 24+ installed
- Docker and Docker Compose installed
- MongoDB instance (local or cloud)
- Redis instance (local or cloud)
- Domain name (for production)
- SSL certificate (for production)

## Local Development Deployment

### 1. Clone and Install

```bash
git clone https://github.com/waqas1412/iot-device-manager.git
cd iot-device-manager
npm install
```

### 2. Start Infrastructure

```bash
npm run docker:up
```

This starts:
- MongoDB on port 27017
- Redis on port 6379
- Mongo Express on port 8081
- Redis Commander on port 8082

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your configuration.

### 4. Build Shared Package

```bash
npm run build:shared
```

### 5. Start Services

```bash
# Option 1: All backend services at once
npm run dev

# Option 2: Individual services in separate terminals
npm run dev:gateway
npm run dev:device
npm run dev:user
npm run dev:analytics
npm run dev:notification

# Frontend
npm run dev:frontend
```

### 6. Access Applications

- Frontend: http://localhost:4200
- API Gateway: http://localhost:3000
- Mongo Express: http://localhost:8081
- Redis Commander: http://localhost:8082

## Production Deployment

### Option 1: Docker Compose (Recommended for Small Scale)

#### 1. Create Production Docker Compose

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
    volumes:
      - mongodb_data:/data/db
    restart: always

  redis:
    image: redis:alpine
    restart: always

  api-gateway:
    build:
      context: .
      dockerfile: packages/api-gateway/Dockerfile
    environment:
      NODE_ENV: production
    ports:
      - "3000:3000"
    depends_on:
      - mongodb
      - redis
    restart: always

  device-service:
    build:
      context: .
      dockerfile: packages/device-service/Dockerfile
    environment:
      NODE_ENV: production
    depends_on:
      - mongodb
    restart: always

  # ... other services

volumes:
  mongodb_data:
```

#### 2. Build and Deploy

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Option 2: Kubernetes (Recommended for Large Scale)

#### 1. Create Kubernetes Manifests

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
    spec:
      containers:
      - name: api-gateway
        image: your-registry/api-gateway:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: mongodb-uri
```

#### 2. Deploy to Kubernetes

```bash
kubectl apply -f k8s/
```

### Option 3: Cloud Platform (AWS/Azure/GCP)

#### AWS Deployment

1. **Create ECR Repositories**
```bash
aws ecr create-repository --repository-name iot-dm/api-gateway
aws ecr create-repository --repository-name iot-dm/device-service
# ... for each service
```

2. **Build and Push Images**
```bash
docker build -t iot-dm/api-gateway ./packages/api-gateway
docker tag iot-dm/api-gateway:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/iot-dm/api-gateway:latest
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/iot-dm/api-gateway:latest
```

3. **Deploy to ECS/EKS**
- Use AWS ECS for container orchestration
- Or use AWS EKS for Kubernetes deployment

4. **Set up Load Balancer**
- Application Load Balancer for HTTP/HTTPS traffic
- Network Load Balancer for WebSocket connections

5. **Configure Auto Scaling**
- Set up auto-scaling groups
- Configure CloudWatch alarms

## Environment Variables

### Production Environment Variables

```env
# Environment
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/iot-dm?retryWrites=true&w=majority
REDIS_URI=redis://your-redis-instance:6379

# JWT
JWT_SECRET=your-production-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-production-refresh-secret-key-min-32-chars

# Service Ports
API_GATEWAY_PORT=3000
DEVICE_SERVICE_PORT=3001
ANALYTICS_SERVICE_PORT=3002
NOTIFICATION_SERVICE_PORT=3003
USER_SERVICE_PORT=3004

# CORS
CORS_ORIGIN=https://your-domain.com

# Logging
LOG_LEVEL=info
```

## Database Setup

### MongoDB Atlas (Recommended)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist IP addresses
5. Get connection string
6. Update `MONGODB_URI` in `.env`

### Self-Hosted MongoDB

```bash
# Install MongoDB
sudo apt-get install mongodb-org

# Start MongoDB
sudo systemctl start mongod

# Enable on boot
sudo systemctl enable mongod
```

## Redis Setup

### Redis Cloud (Recommended)

1. Create Redis Cloud account
2. Create a new database
3. Get connection string
4. Update `REDIS_URI` in `.env`

### Self-Hosted Redis

```bash
# Install Redis
sudo apt-get install redis-server

# Start Redis
sudo systemctl start redis

# Enable on boot
sudo systemctl enable redis
```

## SSL/TLS Configuration

### Using Let's Encrypt

```bash
# Install Certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d your-domain.com

# Configure Nginx
sudo nano /etc/nginx/sites-available/iot-dm
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:4200;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /ws {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

## Monitoring and Logging

### PM2 Process Manager

```bash
# Install PM2
npm install -g pm2

# Start services
pm2 start ecosystem.config.js

# Monitor
pm2 monit

# Logs
pm2 logs

# Auto-start on boot
pm2 startup
pm2 save
```

### PM2 Ecosystem File

```javascript
module.exports = {
  apps: [
    {
      name: 'api-gateway',
      script: './packages/api-gateway/dist/server.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production'
      }
    },
    // ... other services
  ]
};
```

## Health Checks

All services expose `/health` endpoint:

```bash
curl http://localhost:3000/health
```

## Backup Strategy

### MongoDB Backup

```bash
# Backup
mongodump --uri="mongodb://user:pass@host:27017/iot-dm" --out=/backup/$(date +%Y%m%d)

# Restore
mongorestore --uri="mongodb://user:pass@host:27017/iot-dm" /backup/20250101
```

### Redis Backup

```bash
# Redis automatically creates dump.rdb
# Copy to backup location
cp /var/lib/redis/dump.rdb /backup/redis-$(date +%Y%m%d).rdb
```

## Scaling Considerations

### Horizontal Scaling

1. **API Gateway**: Use load balancer (Nginx, HAProxy)
2. **Microservices**: Deploy multiple instances
3. **Database**: MongoDB sharding
4. **Cache**: Redis cluster

### Vertical Scaling

1. Increase server resources (CPU, RAM)
2. Optimize database queries
3. Implement caching strategies
4. Use CDN for static assets

## Security Checklist

- [ ] Use HTTPS/TLS for all connections
- [ ] Set strong JWT secrets
- [ ] Enable rate limiting
- [ ] Implement CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable database authentication
- [ ] Set up firewall rules
- [ ] Regular security updates
- [ ] Implement logging and monitoring
- [ ] Use secure password hashing
- [ ] Validate all inputs
- [ ] Implement RBAC

## Troubleshooting

### Service Won't Start

```bash
# Check logs
pm2 logs service-name

# Check port availability
netstat -tulpn | grep :3000

# Check environment variables
printenv | grep MONGODB
```

### Database Connection Issues

```bash
# Test MongoDB connection
mongo "mongodb://user:pass@host:27017/iot-dm"

# Test Redis connection
redis-cli -h host -p 6379 ping
```

### High Memory Usage

```bash
# Check memory usage
pm2 monit

# Restart service
pm2 restart service-name

# Clear Redis cache
redis-cli FLUSHALL
```

## Rollback Strategy

```bash
# Docker Compose
docker-compose down
git checkout previous-tag
docker-compose up -d

# Kubernetes
kubectl rollout undo deployment/api-gateway
```

## Support

For deployment issues, please open an issue on GitHub or contact support.


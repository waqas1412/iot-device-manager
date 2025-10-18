FROM node:24-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/api-gateway/package*.json ./packages/api-gateway/

# Install dependencies
RUN npm install

# Copy source files
COPY packages/shared ./packages/shared
COPY packages/api-gateway ./packages/api-gateway
COPY tsconfig.json ./

# Build shared package
RUN npm run build --workspace=packages/shared

# Build API Gateway
RUN npm run build --workspace=packages/api-gateway

# Production stage
FROM node:24-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/api-gateway/package*.json ./packages/api-gateway/

# Install production dependencies only
RUN npm install --production --workspace=packages/shared --workspace=packages/api-gateway

# Copy built files
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/api-gateway/dist ./packages/api-gateway/dist

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "packages/api-gateway/dist/server.js"]


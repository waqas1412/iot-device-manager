FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/notification-service/package*.json ./packages/notification-service/

RUN npm ci

COPY packages/shared ./packages/shared
COPY packages/notification-service ./packages/notification-service
COPY tsconfig.json ./

RUN npm run build --workspace=packages/shared
RUN npm run build --workspace=packages/notification-service

FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/notification-service/package*.json ./packages/notification-service/

RUN npm ci --production --workspace=packages/shared --workspace=packages/notification-service

COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/notification-service/dist ./packages/notification-service/dist

ENV NODE_ENV=production

EXPOSE 3003

CMD ["node", "packages/notification-service/dist/server.js"]


FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/device-service/package*.json ./packages/device-service/

RUN npm ci

COPY packages/shared ./packages/shared
COPY packages/device-service ./packages/device-service
COPY tsconfig.json ./

RUN npm run build --workspace=packages/shared
RUN npm run build --workspace=packages/device-service

FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/device-service/package*.json ./packages/device-service/

RUN npm ci --production --workspace=packages/shared --workspace=packages/device-service

COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/device-service/dist ./packages/device-service/dist

ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "packages/device-service/dist/server.js"]


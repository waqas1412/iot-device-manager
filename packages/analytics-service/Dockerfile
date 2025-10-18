FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/analytics-service/package*.json ./packages/analytics-service/

RUN npm install

COPY packages/shared ./packages/shared
COPY packages/analytics-service ./packages/analytics-service
COPY tsconfig.json ./

RUN npm run build --workspace=packages/shared
RUN npm run build --workspace=packages/analytics-service

FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/analytics-service/package*.json ./packages/analytics-service/

RUN npm install --production --workspace=packages/shared --workspace=packages/analytics-service

COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/analytics-service/dist ./packages/analytics-service/dist

ENV NODE_ENV=production

EXPOSE 3002

CMD ["node", "packages/analytics-service/dist/server.js"]


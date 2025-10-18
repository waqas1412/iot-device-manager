FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/user-service/package*.json ./packages/user-service/

RUN npm install

COPY packages/shared ./packages/shared
COPY packages/user-service ./packages/user-service
COPY tsconfig.json ./

RUN npm run build --workspace=packages/shared
RUN npm run build --workspace=packages/user-service

FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/user-service/package*.json ./packages/user-service/

RUN npm install --production --workspace=packages/shared --workspace=packages/user-service

COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/user-service/dist ./packages/user-service/dist

ENV NODE_ENV=production

EXPOSE 3004

CMD ["node", "packages/user-service/dist/server.js"]


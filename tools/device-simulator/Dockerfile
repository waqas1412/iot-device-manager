FROM node:24-alpine

WORKDIR /app

COPY tools/device-simulator/package*.json ./
COPY tools/device-simulator/tsconfig.json ./

RUN npm install

COPY tools/device-simulator/src ./src

RUN npm run build

ENV NODE_ENV=production

CMD ["node", "dist/simulator.js"]


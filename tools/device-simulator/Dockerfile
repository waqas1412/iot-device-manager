FROM node:24-alpine

WORKDIR /app

# Copy root package files and tsconfig
COPY package*.json tsconfig.json ./

# Copy simulator files
COPY tools/device-simulator ./tools/device-simulator

# Install dependencies
RUN cd tools/device-simulator && npm install

# Build TypeScript
RUN cd tools/device-simulator && npm run build

# Set working directory to simulator
WORKDIR /app/tools/device-simulator

ENV NODE_ENV=production

CMD ["node", "dist/simulator.js"]


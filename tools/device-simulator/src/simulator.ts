/**
 * IoT Device Simulator
 * Demonstrates: Device connectivity, metrics generation, real-time communication
 */

import axios from 'axios';
import WebSocket from 'ws';

const API_URL = process.env.API_URL || 'http://localhost:3000';
const WS_URL = process.env.WS_URL || 'ws://localhost:3003';

interface DeviceConfig {
  id: string;
  name: string;
  type: 'sensor' | 'actuator' | 'gateway' | 'controller';
  reportingInterval: number;
}

/**
 * Simulated IoT Device
 * Demonstrates: Device behavior, metrics generation
 */
class SimulatedDevice {
  private ws: WebSocket | null = null;
  private intervalId: NodeJS.Timeout | null = null;

  constructor(private config: DeviceConfig, private accessToken: string) {}

  /**
   * Start device simulation
   */
  start(): void {
    console.log(`[${this.config.name}] Starting device simulation...`);

    // Connect to WebSocket
    this.connectWebSocket();

    // Send metrics periodically
    this.intervalId = setInterval(() => {
      this.sendMetrics();
    }, this.config.reportingInterval * 1000);

    // Update status to online
    this.updateStatus('online');
  }

  /**
   * Stop device simulation
   */
  stop(): void {
    console.log(`[${this.config.name}] Stopping device simulation...`);

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    if (this.ws) {
      this.ws.close();
    }

    this.updateStatus('offline');
  }

  /**
   * Connect to WebSocket server
   */
  private connectWebSocket(): void {
    this.ws = new WebSocket(WS_URL);

    this.ws.on('open', () => {
      console.log(`[${this.config.name}] WebSocket connected`);
    });

    this.ws.on('message', (data) => {
      console.log(`[${this.config.name}] Received message:`, data.toString());
    });

    this.ws.on('close', () => {
      console.log(`[${this.config.name}] WebSocket disconnected`);
    });

    this.ws.on('error', (error) => {
      console.error(`[${this.config.name}] WebSocket error:`, error.message);
    });
  }

  /**
   * Generate and send device metrics
   */
  private async sendMetrics(): Promise<void> {
    const metrics = this.generateMetrics();

    try {
      await axios.post(
        `${API_URL}/analytics/devices/${this.config.id}/metrics`,
        metrics,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
          timeout: 10000, // 10 second timeout
        }
      );

      console.log(`[${this.config.name}] Metrics sent:`, metrics);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`[${this.config.name}] Error sending metrics:`, error.message);
      }
    }
  }

  /**
   * Generate random metrics based on device type
   */
  private generateMetrics(): Record<string, number | string | boolean> {
    const baseMetrics = {
      timestamp: new Date().toISOString(),
      battery: Math.floor(Math.random() * 100),
      signalStrength: Math.floor(Math.random() * 100),
    };

    switch (this.config.type) {
      case 'sensor':
        return {
          ...baseMetrics,
          temperature: 20 + Math.random() * 15,
          humidity: 40 + Math.random() * 40,
          pressure: 990 + Math.random() * 30,
        };

      case 'actuator':
        return {
          ...baseMetrics,
          state: Math.random() > 0.5 ? 'on' : 'off',
          powerConsumption: Math.random() * 100,
        };

      case 'gateway':
        return {
          ...baseMetrics,
          connectedDevices: Math.floor(Math.random() * 20),
          dataRate: Math.random() * 1000,
        };

      case 'controller':
        return {
          ...baseMetrics,
          cpuUsage: Math.random() * 100,
          memoryUsage: Math.random() * 100,
          activeProcesses: Math.floor(Math.random() * 50),
        };

      default:
        return baseMetrics;
    }
  }

  /**
   * Update device status
   */
  private async updateStatus(status: string): Promise<void> {
    try {
      await axios.patch(
        `${API_URL}/devices/${this.config.id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
          timeout: 10000, // 10 second timeout
        }
      );

      console.log(`[${this.config.name}] Status updated to: ${status}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`[${this.config.name}] Error updating status:`, error.message);
      }
    }
  }
}

/**
 * Device Simulator Manager
 */
class DeviceSimulatorManager {
  private devices: SimulatedDevice[] = [];

  /**
   * Initialize and start simulation
   */
  async start(): Promise<void> {
    console.log('IoT Device Simulator starting...');

    // For demo purposes, using a mock token
    // In production, this would authenticate and get a real token
    const accessToken = 'demo-token';

    // Create simulated devices
    const deviceConfigs: DeviceConfig[] = [
      {
        id: 'device-001',
        name: 'Temperature Sensor 1',
        type: 'sensor',
        reportingInterval: 30,
      },
      {
        id: 'device-002',
        name: 'Smart Actuator 1',
        type: 'actuator',
        reportingInterval: 45,
      },
      {
        id: 'device-003',
        name: 'Gateway Hub',
        type: 'gateway',
        reportingInterval: 60,
      },
    ];

    // Start all devices
    for (const config of deviceConfigs) {
      const device = new SimulatedDevice(config, accessToken);
      this.devices.push(device);
      device.start();
    }

    console.log(`Started ${this.devices.length} simulated devices`);

    // Handle graceful shutdown
    process.on('SIGINT', () => this.stop());
    process.on('SIGTERM', () => this.stop());
  }

  /**
   * Stop all devices
   */
  stop(): void {
    console.log('Stopping all devices...');

    for (const device of this.devices) {
      device.stop();
    }

    process.exit(0);
  }
}

// Start the simulator
const manager = new DeviceSimulatorManager();
manager.start();


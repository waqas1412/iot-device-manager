// MongoDB seed script for IoT Device Manager
// Run with: mongosh mongodb://admin:password123@localhost:27017/iot-device-manager?authSource=admin seed-data.js

print('🌱 Starting database seeding...');

// Switch to the database
db = db.getSiblingDB('iot-device-manager');

// Clear existing data
print('🗑️  Clearing existing data...');
db.users.deleteMany({});
db.devices.deleteMany({});

print('✅ Existing data cleared');

// Create users
print('👥 Creating users...');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const users = [
  {
    email: 'admin@iot.com',
    username: 'admin',
    password: '$2b$10$rKJ5VqxW8Y.ZQqZ5qZ5qZOqZ5qZ5qZ5qZ5qZ5qZ5qZ5qZ5qZ5qZ5q', // 'admin123'
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    email: 'user@iot.com',
    username: 'john_doe',
    password: '$2b$10$rKJ5VqxW8Y.ZQqZ5qZ5qZOqZ5qZ5qZ5qZ5qZ5qZ5qZ5qZ5qZ5qZ5q', // 'user123'
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    email: 'demo@iot.com',
    username: 'demo_user',
    password: '$2b$10$rKJ5VqxW8Y.ZQqZ5qZ5qZOqZ5qZ5qZ5qZ5qZ5qZ5qZ5qZ5qZ5qZ5q', // 'demo123'
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const insertedUsers = db.users.insertMany(users);
const userIds = Object.values(insertedUsers.insertedIds);

print(`✅ Created ${userIds.length} users`);
print(`   - admin@iot.com (password: admin123)`);
print(`   - user@iot.com (password: user123)`);
print(`   - demo@iot.com (password: demo123)`);

// Create devices
print('🔌 Creating devices...');

const deviceTypes = ['sensor', 'actuator', 'gateway', 'controller'];
const deviceStatuses = ['online', 'offline', 'error'];
const manufacturers = ['Acme Corp', 'TechSense', 'IoT Solutions', 'SmartDevices Inc', 'ConnectTech'];
const locations = ['Building A - Floor 1', 'Building A - Floor 2', 'Building B - Floor 1', 'Building B - Floor 2', 'Warehouse', 'Parking Lot', 'Server Room', 'Main Entrance'];

const devices = [];

// Temperature Sensors
for (let i = 1; i <= 15; i++) {
  devices.push({
    name: `Temperature Sensor ${i}`,
    type: 'sensor',
    status: deviceStatuses[Math.floor(Math.random() * deviceStatuses.length)],
    userId: userIds[Math.floor(Math.random() * userIds.length)].toString(),
    metadata: {
      manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
      model: `TS-${100 + i}`,
      firmwareVersion: `1.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}`,
      location: locations[Math.floor(Math.random() * locations.length)],
      serialNumber: `SN-TEMP-${1000 + i}`
    },
    configuration: {
      reportingInterval: 30 + Math.floor(Math.random() * 90),
      enabled: Math.random() > 0.1,
      thresholds: {
        min: 15,
        max: 30,
        critical: 35
      }
    },
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    lastSeenAt: new Date(Date.now() - Math.random() * 60 * 60 * 1000)
  });
}

// Humidity Sensors
for (let i = 1; i <= 10; i++) {
  devices.push({
    name: `Humidity Sensor ${i}`,
    type: 'sensor',
    status: deviceStatuses[Math.floor(Math.random() * deviceStatuses.length)],
    userId: userIds[Math.floor(Math.random() * userIds.length)].toString(),
    metadata: {
      manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
      model: `HS-${200 + i}`,
      firmwareVersion: `2.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}`,
      location: locations[Math.floor(Math.random() * locations.length)],
      serialNumber: `SN-HUM-${2000 + i}`
    },
    configuration: {
      reportingInterval: 60 + Math.floor(Math.random() * 120),
      enabled: Math.random() > 0.1,
      thresholds: {
        min: 30,
        max: 70,
        critical: 85
      }
    },
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    lastSeenAt: new Date(Date.now() - Math.random() * 60 * 60 * 1000)
  });
}

// Smart Actuators
for (let i = 1; i <= 8; i++) {
  devices.push({
    name: `Smart Actuator ${i}`,
    type: 'actuator',
    status: deviceStatuses[Math.floor(Math.random() * deviceStatuses.length)],
    userId: userIds[Math.floor(Math.random() * userIds.length)].toString(),
    metadata: {
      manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
      model: `ACT-${300 + i}`,
      firmwareVersion: `3.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}`,
      location: locations[Math.floor(Math.random() * locations.length)],
      serialNumber: `SN-ACT-${3000 + i}`,
      actuatorType: ['valve', 'switch', 'motor', 'relay'][Math.floor(Math.random() * 4)]
    },
    configuration: {
      reportingInterval: 120,
      enabled: Math.random() > 0.1,
      powerRating: `${Math.floor(Math.random() * 500) + 100}W`
    },
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    lastSeenAt: new Date(Date.now() - Math.random() * 60 * 60 * 1000)
  });
}

// IoT Gateways
for (let i = 1; i <= 5; i++) {
  devices.push({
    name: `IoT Gateway ${i}`,
    type: 'gateway',
    status: deviceStatuses[Math.floor(Math.random() * deviceStatuses.length)],
    userId: userIds[Math.floor(Math.random() * userIds.length)].toString(),
    metadata: {
      manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
      model: `GW-${400 + i}`,
      firmwareVersion: `4.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}`,
      location: locations[Math.floor(Math.random() * locations.length)],
      serialNumber: `SN-GW-${4000 + i}`,
      connectedDevices: Math.floor(Math.random() * 20) + 5
    },
    configuration: {
      reportingInterval: 300,
      enabled: Math.random() > 0.05,
      protocols: ['MQTT', 'CoAP', 'HTTP'],
      maxConnections: 50
    },
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    lastSeenAt: new Date(Date.now() - Math.random() * 60 * 60 * 1000)
  });
}

// Controllers
for (let i = 1; i <= 7; i++) {
  devices.push({
    name: `Controller ${i}`,
    type: 'controller',
    status: deviceStatuses[Math.floor(Math.random() * deviceStatuses.length)],
    userId: userIds[Math.floor(Math.random() * userIds.length)].toString(),
    metadata: {
      manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
      model: `CTRL-${500 + i}`,
      firmwareVersion: `5.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}`,
      location: locations[Math.floor(Math.random() * locations.length)],
      serialNumber: `SN-CTRL-${5000 + i}`,
      controlType: ['HVAC', 'Lighting', 'Access', 'Security'][Math.floor(Math.random() * 4)]
    },
    configuration: {
      reportingInterval: 180,
      enabled: Math.random() > 0.1,
      automationEnabled: Math.random() > 0.3
    },
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    lastSeenAt: new Date(Date.now() - Math.random() * 60 * 60 * 1000)
  });
}

const insertedDevices = db.devices.insertMany(devices);

print(`✅ Created ${devices.length} devices:`);
print(`   - 15 Temperature Sensors`);
print(`   - 10 Humidity Sensors`);
print(`   - 8 Smart Actuators`);
print(`   - 5 IoT Gateways`);
print(`   - 7 Controllers`);

// Create indexes
print('📇 Creating indexes...');

db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });

db.devices.createIndex({ userId: 1 });
db.devices.createIndex({ type: 1 });
db.devices.createIndex({ status: 1 });
db.devices.createIndex({ createdAt: -1 });

print('✅ Indexes created');

// Summary
print('\n🎉 Database seeding completed successfully!');
print('\n📊 Summary:');
print(`   - Users: ${userIds.length}`);
print(`   - Devices: ${devices.length}`);
print('\n🔑 Login credentials:');
print('   - Admin: admin@iot.com / admin123');
print('   - User: user@iot.com / user123');
print('   - Demo: demo@iot.com / demo123');
print('\n🚀 You can now start using the application!');


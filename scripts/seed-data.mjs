/**
 * Database seeding script with retry logic
 * Run with: node seed-data.mjs
 */

import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password123@mongodb:27017/iot-device-manager?authSource=admin';
const MAX_RETRIES = 10;
const RETRY_DELAY = 3000; // 3 seconds

/**
 * Wait for specified milliseconds
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Connect to MongoDB with retry logic
 */
async function connectWithRetry() {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`🔌 Connection attempt ${attempt}/${MAX_RETRIES}...`);
      const client = new MongoClient(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      });
      await client.connect();
      console.log('✅ Connected to MongoDB successfully');
      return client;
    } catch (error) {
      console.log(`⚠️  Connection attempt ${attempt} failed: ${error.message}`);
      
      if (attempt === MAX_RETRIES) {
        console.error('❌ Max retries reached. Could not connect to MongoDB.');
        throw error;
      }
      
      console.log(`⏳ Waiting ${RETRY_DELAY / 1000} seconds before retry...`);
      await sleep(RETRY_DELAY);
    }
  }
}

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  console.log(`📍 MongoDB URI: ${MONGODB_URI.replace(/:[^:@]+@/, ':****@')}`);
  
  let client;
  
  try {
    // Connect with retry logic
    client = await connectWithRetry();
    
    const db = client.db('iot-device-manager');
    
    // Verify connection
    await db.admin().ping();
    console.log('✅ Database connection verified');
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await db.collection('users').deleteMany({});
    await db.collection('devices').deleteMany({});
    console.log('✅ Existing data cleared');
    
    // Create users
    console.log('👥 Creating users...');
    
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const userPassword = await bcrypt.hash('User@123', 10);
    
    const users = [
      {
        email: 'admin@iot.com',
        username: 'admin',
        password: adminPassword,
        role: 'admin',
        profile: {
          firstName: 'Admin',
          lastName: 'User',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'user@iot.com',
        username: 'user',
        password: userPassword,
        role: 'user',
        profile: {
          firstName: 'Regular',
          lastName: 'User',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    
    const userResult = await db.collection('users').insertMany(users);
    console.log(`✅ Created ${userResult.insertedCount} users`);
    
    const adminUserId = userResult.insertedIds[0];
    
    // Create devices
    console.log('📱 Creating devices...');
    
    const deviceTypes = ['temperature', 'humidity', 'actuator', 'gateway', 'controller'];
    const manufacturers = ['Bosch', 'Siemens', 'Honeywell', 'Schneider', 'ABB'];
    const locations = ['Building A - Floor 1', 'Building A - Floor 2', 'Building B - Floor 1', 'Building C - Basement', 'Warehouse'];
    const statuses = ['online', 'offline', 'error'];
    
    const devices = [];
    
    for (let i = 1; i <= 45; i++) {
      const type = deviceTypes[i % deviceTypes.length];
      const status = i % 7 === 0 ? 'offline' : i % 11 === 0 ? 'error' : 'online';
      
      devices.push({
        id: `device-${String(i).padStart(3, '0')}`,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Sensor ${i}`,
        type,
        status,
        userId: adminUserId,
        metadata: {
          manufacturer: manufacturers[i % manufacturers.length],
          model: `Model-${type.toUpperCase()}-${i}`,
          firmwareVersion: `v${Math.floor(i / 10) + 1}.${i % 10}.0`,
          location: locations[i % locations.length],
        },
        lastSeenAt: new Date(Date.now() - Math.random() * 3600000), // Random time within last hour
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 30), // Random time within last 30 days
        updatedAt: new Date(),
      });
    }
    
    const deviceResult = await db.collection('devices').insertMany(devices);
    console.log(`✅ Created ${deviceResult.insertedCount} devices`);
    
    // Create indexes
    console.log('📇 Creating indexes...');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('devices').createIndex({ id: 1 }, { unique: true });
    await db.collection('devices').createIndex({ userId: 1 });
    await db.collection('devices').createIndex({ status: 1 });
    await db.collection('devices').createIndex({ type: 1 });
    console.log('✅ Indexes created');
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Users: ${userResult.insertedCount}`);
    console.log(`   - Devices: ${deviceResult.insertedCount}`);
    console.log(`\n🔑 Login credentials:`);
    console.log(`   Admin: admin@iot.com / Admin@123`);
    console.log(`   User: user@iot.com / User@123`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\n✅ Database connection closed');
    }
  }
}

// Run the seeding
seedDatabase().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});


/**
 * Database seeding script
 * Run with: node seed-data.mjs
 */

import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password123@mongodb:27017/iot-device-manager?authSource=admin';

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('iot-device-manager');
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await db.collection('users').deleteMany({});
    await db.collection('devices').deleteMany({});
    console.log('✅ Existing data cleared');
    
    // Create users
    console.log('👥 Creating users...');
    
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);
    
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
    console.log(`   Admin: admin@iot.com / admin123`);
    console.log(`   User: user@iot.com / user123`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n✅ Database connection closed');
  }
}

seedDatabase();


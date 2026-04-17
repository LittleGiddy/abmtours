require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('MONGODB_URI not found in .env.local');
    console.log('Current working directory:', process.cwd());
    process.exit(1);
  }
  
  console.log('Connecting to MongoDB...');
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('abmtours');
    
    const email = 'admin@abmtours.co.tz';
    const password = 'Admin123!';
    
    const existing = await db.collection('admins').findOne({ email });
    if (existing) {
      console.log('Admin already exists!');
      process.exit(0);
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.collection('admins').insertOne({
      email,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    console.log('✅ Admin created!');
    console.log('Email:', email);
    console.log('Password:', password);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

createAdmin();
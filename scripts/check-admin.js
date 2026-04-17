require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function checkAdmin() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('MONGODB_URI not found');
    process.exit(1);
  }
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('abmtours');
    
    // Check all admins
    const admins = await db.collection('admins').find({}).toArray();
    
    console.log('📊 Total admins found:', admins.length);
    console.log('📋 Admin list:');
    admins.forEach(admin => {
      console.log(`   - Email: ${admin.email}`);
      console.log(`     Password hash: ${admin.password.substring(0, 30)}...`);
      console.log(`     Created: ${admin.createdAt}`);
      console.log('   ---');
    });
    
    if (admins.length === 0) {
      console.log('⚠️ No admin found! You need to create one.');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkAdmin();
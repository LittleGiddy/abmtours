require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function testPassword() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('abmtours');
    
    const email = 'admin@abmtours.co.tz';
    // Try these passwords (one of them should work)
    const passwordsToTry = ['admin123', 'Admin123!', 'password123', 'admin@123'];
    
    console.log('🔍 Testing password for:', email);
    
    const admin = await db.collection('admins').findOne({ email });
    
    if (!admin) {
      console.log('❌ Admin not found');
      return;
    }
    
    console.log('✅ Admin found');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Stored hash:', admin.password.substring(0, 20) + '...');
    
    console.log('\n📝 Testing passwords:');
    
    let matched = false;
    for (const testPassword of passwordsToTry) {
      const isMatch = await bcrypt.compare(testPassword, admin.password);
      console.log(`   Password "${testPassword}": ${isMatch ? '✅ MATCHES!' : '❌ No'}`);
      if (isMatch) {
        matched = true;
        console.log(`\n🎉 CORRECT PASSWORD IS: "${testPassword}"`);
      }
    }
    
    if (!matched) {
      console.log('\n⚠️ None of the test passwords matched.');
      console.log('You need to reset the admin password.');
      
      // Option to reset password
      const newPassword = 'Admin123!';
      const newHash = await bcrypt.hash(newPassword, 10);
      
      await db.collection('admins').updateOne(
        { email },
        { $set: { password: newHash, updatedAt: new Date() } }
      );
      
      console.log(`\n✅ Password has been reset to: "${newPassword}"`);
      console.log('Try logging in with this password.');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

testPassword();
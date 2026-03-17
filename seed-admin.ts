import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import clientPromise from './lib/mongodb';
import bcrypt from 'bcryptjs';

async function seedAdmin() {
  const client = await clientPromise;
  const db = client.db();

  const email = 'info@abmtours.co.tz';   // ← change this
  const password = 'admin12345';  // ← change this

  const existing = await db.collection('admins').findOne({ email });
  if (existing) {
    console.log('Admin already exists');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.collection('admins').insertOne({
    email,
    password: hashedPassword,
    createdAt: new Date(),
  });

  console.log('✅ Admin created successfully');
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
// scripts/hash-password.ts
import bcrypt from 'bcryptjs';

async function run() {
  const password = 'admin12345'; // replace with your desired password
  const hash = await bcrypt.hash(password, 10);
  console.log('Hashed password:', hash);
}

run();

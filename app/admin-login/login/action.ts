'use server';

import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function loginAdmin({ email, password }: { email: string; password: string }) {
  const client = await clientPromise;
  const db = client.db();
  const admin = await db.collection('admins').findOne({ email });

  if (!admin) {
    return { success: false, message: 'Admin not found' };
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    return { success: false, message: 'Incorrect password' };
  }

  // ✅ Await cookies() before using set()
  const cookieStore = await cookies();
  cookieStore.set('admin-auth', 'true', {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });

  return { success: true, message: 'Login successful' };
}

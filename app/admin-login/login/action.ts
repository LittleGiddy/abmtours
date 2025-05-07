'use server';

import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function loginAdmin({ email, password }: { email: string; password: string }) {
  const client = await clientPromise;
  const db = client.db();
  const admin = await db.collection('admins').findOne({ email });

  if (!admin) {
    return NextResponse.json({ success: false, message: 'Admin not found' });
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    return NextResponse.json({ success: false, message: 'Incorrect password' });
  }

  const res = NextResponse.json({ success: true });

  // ✅ Set the cookie on the response
  res.cookies.set('admin-auth', 'true', {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });

  return res;
}

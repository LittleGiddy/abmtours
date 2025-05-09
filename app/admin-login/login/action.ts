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

  // Optional: Strip sensitive fields
  const { password: _pw, ...safeAdmin } = admin;
  const safeAdminJson = JSON.parse(JSON.stringify(safeAdmin)); // 👈 serialize it

  const res = NextResponse.json({ success: true, admin: safeAdminJson });

  res.cookies.set('admin-auth', 'true', {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });

  return res;
}

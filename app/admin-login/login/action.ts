'use server';

import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function loginAdmin({ email, password }: { email: string; password: string }) {
  try {
    const client = await clientPromise;
    // Specify the database name - make sure it matches your bookings API
    const db = client.db('abmtours'); // Changed from db() to db('abmtours')
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
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return { success: true, message: 'Login successful' };
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Login failed' 
    };
  }
}

// Optional: Add a logout function
export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin-auth');
  return { success: true };
}

// Optional: Add a function to check if admin is logged in
export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('admin-auth');
  return authCookie?.value === 'true';
}
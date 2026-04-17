'use server';

import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';


export async function loginAdmin({ email, password }: { email: string; password: string }) {
  // Move redirect outside of try-catch
  try {
    if (!email || !password) {
      return { success: false, message: 'Email and password are required' };
    }
    
    const client = await clientPromise;
    const db = client.db('abmtours');
    const admin = await db.collection('admins').findOne({ email });

    if (!admin) {
      return { success: false, message: 'Invalid email or password' };
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return { success: false, message: 'Invalid email or password' };
    }

    const cookieStore = await cookies();
    cookieStore.set('admin-auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24,
    });
    
    cookieStore.set('admin-email', email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    // Success! Return success and let client handle redirect
    return { success: true, message: 'Login successful' };

  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      message: 'Login failed. Please try again.' 
    };
  }
}
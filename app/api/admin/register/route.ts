export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getClientPromise } from '@/lib/mongodb'; // ✅ named import
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password, secretKey } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const expectedSecret = process.env.ADMIN_SECRET_KEY;
    if (!expectedSecret) {
      return NextResponse.json(
        { success: false, message: 'Admin setup is not configured' },
        { status: 503 }
      );
    }

    if (!secretKey || secretKey !== expectedSecret) {
      return NextResponse.json(
        { success: false, message: 'Invalid secret key' },
        { status: 403 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }
    
    const client = await getClientPromise(); // ✅ call it as a function
    const db = client.db('abmtours');
    
    // Bootstrap only: once an admin exists this endpoint is permanently closed
    const adminCount = await db.collection('admins').countDocuments();
    if (adminCount > 0) {
      return NextResponse.json(
        { success: false, message: 'Admin already exists' },
        { status: 403 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create admin
    const result = await db.collection('admins').insertOne({
      email,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    return NextResponse.json({
      success: true,
      message: 'Admin created successfully',
      adminId: result.insertedId
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Registration failed' },
      { status: 500 }
    );
  }
}
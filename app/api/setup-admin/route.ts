export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getClientPromise } from '@/lib/mongodb'; // ✅ named import
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password, secretKey } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const expectedSecret = process.env.ADMIN_SECRET_KEY;
    if (!expectedSecret) {
      return NextResponse.json({ error: 'Admin setup is not configured' }, { status: 503 });
    }

    if (!secretKey || secretKey !== expectedSecret) {
      return NextResponse.json({ error: 'Invalid secret key' }, { status: 403 });
    }

      const client = await getClientPromise(); // ✅ called at runtime
    const db = client.db('abmtours');

    // Bootstrap only: once an admin exists this endpoint is permanently closed
    const adminCount = await db.collection('admins').countDocuments();
    if (adminCount > 0) {
      return NextResponse.json({ error: 'Admin already exists' }, { status: 403 });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create admin
    const result = await db.collection('admins').insertOne({
      email,
      password: hashedPassword,
      createdAt: new Date(),
      role: 'admin'
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Admin created successfully',
      id: result.insertedId 
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Setup failed' 
    }, { status: 500 });
  }
}
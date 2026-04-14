import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('abmtours');
    
    // Check if admin already exists
    const existingAdmin = await db.collection('admins').findOne({ email });
    if (existingAdmin) {
      return NextResponse.json({ error: 'Admin already exists' }, { status: 400 });
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
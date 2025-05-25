// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// GET: Fetch all messages
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('abmtours');
    const messages = await db.collection('messages').find().toArray();
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Fetch messages error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST: Save a new message
export async function POST(request: Request) {
  const body = await request.json();
  const { fullName, email, message } = body;

  if (!fullName || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('abmtours');
    const collection = db.collection('messages');
    const result = await collection.insertOne({ fullName, email, message, createdAt: new Date() });

    return NextResponse.json({ message: "Message saved!", id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('MongoDB insert error:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

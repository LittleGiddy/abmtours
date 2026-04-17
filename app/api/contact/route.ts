// app/api/contact/route.ts
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getClientPromise } from '@/lib/mongodb'; // ✅ named import

// GET: Fetch all messages
export async function GET() {
  try {
       const client = await getClientPromise(); // ✅ call it as a function
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
       const client = await getClientPromise(); // ✅ call it as a function
    const db = client.db('abmtours');
    const collection = db.collection('messages');
    const result = await collection.insertOne({ fullName, email, message, createdAt: new Date() });

    return NextResponse.json({ message: "Message saved!", id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('MongoDB insert error:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

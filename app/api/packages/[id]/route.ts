// app/api/packages/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise();
    const db = client.db('abmtours');
    const pkg = await db.collection('packages').findOne({ _id: new ObjectId(id) });
    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }
    return NextResponse.json(pkg);
  } catch (error) {
    console.error('GET /api/packages/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch package' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise();
    const db = client.db('abmtours');
    const body = await request.json();
    
    // Remove _id if present (it shouldn't be sent, but just in case)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id: _ignored, ...updateData } = body;

    const result = await db.collection('packages').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    const updated = await db.collection('packages').findOne({ _id: new ObjectId(id) });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/packages/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise();
    const db = client.db('abmtours');
    const result = await db.collection('packages').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/packages/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 });
  }
}
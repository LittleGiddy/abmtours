import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Define a type for the allowed update fields (no `any`)
type AllowedUpdate = {
  alt?: string;
  order?: number;
  // add other updatable fields here if needed
  [key: string]: unknown; // only if you really need dynamic keys; better to list them explicitly
};

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = (await req.json()) as AllowedUpdate;
    const { alt, order } = body;

    const client = await clientPromise();
    const db = client.db('abmtours');
    const collection = db.collection('destinationimages');

    const updateFields: Partial<AllowedUpdate> = {};
    if (alt !== undefined) updateFields.alt = alt;
    if (order !== undefined) updateFields.order = order;

    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    return NextResponse.json({ success: true });
  } catch (err) {   // ✅ renamed to `err` to avoid "unused variable" if you don't need it
    // If you need the error, use `err`; otherwise omit the parameter
    console.error('Update error:', err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const client = await clientPromise();
    const db = client.db('abmtours');
    const collection = db.collection('destinationimages');

    await collection.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete error:', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

type Params = {
  params: Promise<{ id: string }> | { id: string };
};

export async function PUT(
  request: NextRequest,
  context: Params
) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as { alt?: string; order?: number };
    const { alt, order } = body;

    const client = await clientPromise();
    const db = client.db('abmtours');
    const collection = db.collection('destinationimages');

    const updateFields: { alt?: string; order?: number } = {};
    if (alt !== undefined) updateFields.alt = alt;
    if (order !== undefined) updateFields.order = order;

    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('PUT error:', err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: Params
) {
  try {
    const { id } = await context.params;
    const client = await clientPromise();
    const db = client.db('abmtours');
    const collection = db.collection('destinationimages');

    await collection.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE error:', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
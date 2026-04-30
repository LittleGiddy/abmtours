import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { alt, order } = body;

    const client = await clientPromise();
    const db = client.db('abmtours');
    const collection = db.collection('destinationimages');

    const update: any = {};
    if (alt !== undefined) update.alt = alt;
    if (order !== undefined) update.order = order;

    await collection.updateOne({ _id: new ObjectId(id) }, { $set: update });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const client = await clientPromise();
    const db = client.db('abmtours');
    const collection = db.collection('destinationimages');
    await collection.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
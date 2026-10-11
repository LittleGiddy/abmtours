import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { removeStoredAsset } from '@/lib/media';
import { requireAdmin } from '@/lib/adminAuth';
import { ObjectId } from 'mongodb';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const { id } = await params;
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const { id } = await params;
    const client = await clientPromise();
    const db = client.db('abmtours');
    const collection = db.collection('destinationimages');

    const image = await collection.findOne({ _id: new ObjectId(id) });
    if (image) {
      try {
        await removeStoredAsset({ url: image.url, publicId: image.publicId });
      } catch (assetError) {
        console.warn('Failed to delete image asset:', assetError);
      }
    }

    await collection.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE error:', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
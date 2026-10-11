import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { removeStoredAsset } from '@/lib/media';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET() {
  try {
    const client = await clientPromise();
    const db = client.db('abmtours');
    const collection = db.collection('destinationimages');

    const images = await collection.find({}).sort({ order: 1, createdAt: -1 }).toArray();
    return NextResponse.json(images);
  } catch (error) {
    console.error('GET /api/destination-images error:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const client = await clientPromise();
    const db = client.db('abmtours');
    const collection = db.collection('destinationimages');
    const { ObjectId } = await import('mongodb');

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
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
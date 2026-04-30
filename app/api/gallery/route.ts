import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise();
    const db = client.db('abmtours');
    const gallery = await db
      .collection('gallery')
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();
    return NextResponse.json(gallery);
  } catch (error) {
    console.error('GET /api/gallery error:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const alt = (formData.get('alt') as string) || 'Gallery image';
    const caption = (formData.get('caption') as string) || '';  // ✅ new
    const category = (formData.get('category') as string) || 'safari';

    if (!file) {
      return NextResponse.json({ error: 'No image file' }, { status: 400 });
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be less than 2MB' }, { status: 400 });
    }

    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    const client = await clientPromise();
    const db = client.db('abmtours');
    const collection = db.collection('gallery');

    const maxOrderDoc = await collection.findOne({}, { sort: { order: -1 } });
    const newOrder = (maxOrderDoc?.order ?? 0) + 1;

    const newImage = {
      url: blob.url,
      filename: blob.pathname,
      alt,
      caption,      // ✅ store caption
      category,
      order: newOrder,
      createdAt: new Date(),
    };
    const result = await collection.insertOne(newImage);

    return NextResponse.json(
      { success: true, image: { _id: result.insertedId, ...newImage } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
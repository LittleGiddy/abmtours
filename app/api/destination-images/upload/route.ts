import { put } from '@vercel/blob';
import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const alt = (formData.get('alt') as string) || 'Destination image';

    if (!file) {
      return NextResponse.json({ error: 'No image file' }, { status: 400 });
    }

    // 1. Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    // 2. Use native MongoDB driver (no Mongoose)
    const client = await clientPromise();   // ✅ call the function
    const db = client.db('abmtours');
    const collection = db.collection('destinationimages');

    const newImage = {
      url: blob.url,
      filename: blob.pathname,
      alt,
      createdAt: new Date(),
      order: 0,
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
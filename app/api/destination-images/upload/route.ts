import { uploadImage } from '@/lib/cloudinary';
import { requireAdmin } from '@/lib/adminAuth';
import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const formData = await request.formData();
    const file = formData.get('image') as File;
    const alt = (formData.get('alt') as string) || 'Destination image';

    if (!file) {
      return NextResponse.json({ error: 'No image file' }, { status: 400 });
    }

    // 1. Upload to Cloudinary
    const asset = await uploadImage(file, 'abmtours/destinations');

    // 2. Use native MongoDB driver (no Mongoose)
    const client = await clientPromise();   // ✅ call the function
    const db = client.db('abmtours');
    const collection = db.collection('destinationimages');

    const newImage = {
      url: asset.url,
      publicId: asset.publicId,
      filename: file.name,
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
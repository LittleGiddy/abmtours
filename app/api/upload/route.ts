// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import { requireAdmin } from '@/lib/adminAuth';

// Only these folders may be written to via the upload endpoint.
const ALLOWED_FOLDERS = [
  'abmtours',
  'abmtours/gallery',
  'abmtours/destinations',
  'abmtours/packages',
  'abmtours/content',
];

export async function POST(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const requestedFolder = (formData.get('folder') as string) || 'abmtours/packages';
    const folder = ALLOWED_FOLDERS.includes(requestedFolder) ? requestedFolder : 'abmtours';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Optional: file size validation (max 10 MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
    }

    // Optional: allow only images
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    const asset = await uploadImage(file, folder);

    return NextResponse.json({
      url: asset.url,
      publicId: asset.publicId,
      width: asset.width,
      height: asset.height,
    });
  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
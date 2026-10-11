import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import { defaultSection } from '@/lib/siteContent';

// GET /api/site-content          -> all stored section content
// GET /api/site-content?key=xyz  -> a single section (falls back to defaults)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    const client = await clientPromise();
    const db = client.db('abmtours');
    const collection = db.collection('sitecontent');

    if (key) {
      const doc = await collection.findOne({ key });
      const content = doc
        ? { key, heading: doc.heading ?? '', tagline: doc.tagline ?? '' }
        : defaultSection(key);
      return NextResponse.json(content);
    }

    const docs = await collection.find({}).toArray();
    return NextResponse.json(docs);
  } catch (error) {
    console.error('GET /api/site-content error:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

// PUT /api/site-content  { key, heading, tagline }
export async function PUT(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const body = (await request.json()) as {
      key?: string;
      heading?: string;
      tagline?: string;
    };

    if (!body.key) {
      return NextResponse.json({ error: 'key is required' }, { status: 400 });
    }

    const client = await clientPromise();
    const db = client.db('abmtours');

    await db.collection('sitecontent').updateOne(
      { key: body.key },
      {
        $set: {
          key: body.key,
          heading: body.heading ?? '',
          tagline: body.tagline ?? '',
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT /api/site-content error:', error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}

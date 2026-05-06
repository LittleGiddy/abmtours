// app/api/packages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise();
    const db = client.db('abmtours');
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    let query = {};
    if (slug) {
      query = { slug };
    }

    const packages = await db
      .collection('packages')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    // If slug is provided, return single object or array? For detail page, return first match or array.
    if (slug) {
      const pkg = packages[0] || null;
      return NextResponse.json(pkg);
    }

    return NextResponse.json(packages);
  } catch (error) {
    console.error('GET /api/packages error:', error);
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise();
    const db = client.db('abmtours');
    const body = await request.json();

    // Generate slug if not provided
    if (!body.slug) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }

    // Check for duplicate slug
    const existing = await db.collection('packages').findOne({ slug: body.slug });
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const newPackage = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('packages').insertOne(newPackage);
    return NextResponse.json(
      { _id: result.insertedId, ...newPackage },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/packages error:', error);
    return NextResponse.json({ error: 'Failed to create package' }, { status: 500 });
  }
}
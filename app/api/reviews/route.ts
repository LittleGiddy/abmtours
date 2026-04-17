import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Validation function
const validateReview = (data: any) => {
  const errors: string[] = [];
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters');
  }
  
  if (!data.rating || typeof data.rating !== 'number' || data.rating < 1 || data.rating > 5) {
    errors.push('Rating must be a number between 1 and 5');
  }
  
  if (!data.text || typeof data.text !== 'string' || data.text.trim().length < 10) {
    errors.push('Review text is required and must be at least 10 characters');
  }
  
  if (!data.date) {
    errors.push('Date is required');
  }
  
  return errors;
};

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('abmtours');
    
    const reviews = await db.collection('reviews')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    // Remove profileImage from response (if any exists in old data)
    const cleanedReviews = reviews.map(({ profileImage, ...review }) => review);
    
    return NextResponse.json({ success: true, reviews: cleanedReviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const errors = validateReview(body);
    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }
    
    const { name, rating, text, date, verified, tripType, destination } = body;
    
    const client = await clientPromise;
    const db = client.db('abmtours');
    
    const review = {
      name: name.trim(),
      rating: Number(rating),
      text: text.trim(),
      date: new Date(date).toISOString(),
      verified: verified === true || verified === 'true',
      tripType: tripType || null,
      destination: destination || null,
      helpful: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await db.collection('reviews').insertOne(review);
    
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      review: { ...review, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Review ID required' },
        { status: 400 }
      );
    }
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid review ID' },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db('abmtours');
    
    const result = await db.collection('reviews').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Review ID required' },
        { status: 400 }
      );
    }
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid review ID' },
        { status: 400 }
      );
    }
    
    // Validate update data
    if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }
    
    // Remove profileImage if somehow sent
    delete updateData.profileImage;
    
    const client = await clientPromise;
    const db = client.db('abmtours');
    
    const updateFields: any = {
      ...updateData,
      updatedAt: new Date()
    };
    
    if (updateFields.rating) updateFields.rating = Number(updateFields.rating);
    
    const result = await db.collection('reviews').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update review' },
      { status: 500 }
    );
  }
}
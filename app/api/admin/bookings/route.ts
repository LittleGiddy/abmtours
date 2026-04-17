import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';  // ⚠️ Add this import

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('abmtours');
    const bookings = await db.collection('bookings').find({}).toArray();
    
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('abmtours');
    
    const result = await db.collection('bookings').insertOne({
      ...body,
      createdAt: new Date(),
    });
    
    return NextResponse.json(
      { success: true, id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

// ✅ ADD THIS DELETE METHOD
export async function DELETE(request: Request) {
  try {
    // Get the ID from the URL query parameter
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    console.log('Deleting booking with ID:', id);
    
    // Check if ID is provided
    if (!id) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }
    
    // Validate if the ID is a valid MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid booking ID format' },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db('abmtours');
    
    // Delete the booking
    const result = await db.collection('bookings').deleteOne({
      _id: new ObjectId(id)
    });
    
    // Check if a document was actually deleted
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Booking deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
}
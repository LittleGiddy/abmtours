import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET: Fetch all bookings
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('abmtours');
    const bookings = await db.collection('bookings').find().toArray();
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// POST: Save a new booking
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      travelType,
      tripEnhancements = [],
      accommodation,
      airportPickup,
      expectedDate,
      budget,
      nights,
      adults,
      children = "0",
      destinations = [],
      additionalInfo = "",
      agreeToTerms = false,
      agreeToInfo = false,
    } = body;

    // Required fields validation
    const requiredFields = [
      firstName,
      lastName,
      email,
      phone,
      travelType,
      accommodation,
      airportPickup,
      expectedDate,
      budget,
      nights,
      adults,
      agreeToInfo,
    ];

    if (requiredFields.some(field => !field)) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('abmtours');

    const result = await db.collection('bookings').insertOne({
      firstName,
      lastName,
      email,
      phone,
      travelType,
      tripEnhancements,
      accommodation,
      airportPickup,
      expectedDate,
      budget,
      nights,
      adults,
      children: children || "0",
      destinations,
      additionalInfo,
      agreeToTerms,
      agreeToInfo,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: 'Booking saved successfully!', id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('MongoDB insert error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}

// DELETE: Remove a booking by ID from query params
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: 'Invalid or missing booking ID' }, 
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db('abmtours');
    const result = await db.collection('bookings').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: 'Booking deleted' });
    } else {
      return NextResponse.json(
        { error: 'Booking not found' }, 
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete booking' }, 
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    const missingFields = [];
    
    if (!firstName) missingFields.push('firstName');
    if (!lastName) missingFields.push('lastName');
    if (!email) missingFields.push('email');
    if (!phone) missingFields.push('phone');
    if (!travelType) missingFields.push('travelType');
    if (!accommodation) missingFields.push('accommodation');
    if (!airportPickup) missingFields.push('airportPickup');
    if (!expectedDate) missingFields.push('expectedDate');
    if (!budget) missingFields.push('budget');
    if (!nights) missingFields.push('nights');
    if (!adults) missingFields.push('adults');
    if (typeof agreeToInfo !== 'boolean') missingFields.push('agreeToInfo');
    if (typeof agreeToTerms !== 'boolean') missingFields.push('agreeToTerms');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` }, 
        { status: 400 }
      );
    }

    // Email validation
    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email format' }, 
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
      budget: Number(budget),
      nights: Number(nights),
      adults: Number(adults),
      children: children ? Number(children) : 0,
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
    
    // Type-safe error handling
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    
    return NextResponse.json(
      { error: errorMessage }, 
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
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete booking';
    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    );
  }
}
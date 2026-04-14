import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

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

    // Required fields validation - FIXED for boolean values
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
    // For boolean fields, check if they're defined (they can be false)
    if (typeof agreeToInfo !== 'boolean') missingFields.push('agreeToInfo');
    if (typeof agreeToTerms !== 'boolean') missingFields.push('agreeToTerms');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` }, 
        { status: 400 }
      );
    }

    // Additional validation
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
      budget: Number(budget), // Ensure budget is stored as number
      nights: Number(nights), // Ensure nights is stored as number
      adults: Number(adults), // Ensure adults is stored as number
      children: children ? Number(children) : 0, // Ensure children is stored as number
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
 // Option 1: Type assertion (simplest)
} catch (error) {
  console.error('MongoDB insert error:', error);
  return NextResponse.json(
    { error: error instanceof Error ? error.message : 'Internal Server Error' }, 
    { status: 500 }
  );
}
}
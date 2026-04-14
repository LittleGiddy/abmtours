import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasPlaceId: !!process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID,
    hasApiKey: !!process.env.GOOGLE_MAPS_API_KEY,
    placeIdValue: process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || 'missing',
    apiKeyPrefix: process.env.GOOGLE_MAPS_API_KEY ? 
      process.env.GOOGLE_MAPS_API_KEY.substring(0, 10) + '...' : 
      'missing',
    nodeEnv: process.env.NODE_ENV,
  });
}
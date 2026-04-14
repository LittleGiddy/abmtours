import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!placeId || !apiKey) {
      console.error('Missing environment variables');
      return NextResponse.json(
        { success: false, error: 'Configuration error' },
        { status: 500 }
      );
    }

    console.log('Fetching reviews for placeId:', placeId);
    console.log('API Key exists:', !!apiKey);
    console.log('API Key prefix:', apiKey.substring(0, 10));

    // Try the old Places API (more reliable for reviews)
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,user_ratings_total&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    console.log('Google API Status:', data.status);
    console.log('Google API Response:', JSON.stringify(data, null, 2));

    if (data.status !== 'OK') {
      console.error('Google API Error:', data.status, data.error_message);
      return NextResponse.json(
        { 
          success: false, 
          error: `Google API Error: ${data.status}`,
          details: data.error_message || 'No additional details'
        },
        { status: 403 }
      );
    }

    const result = data.result;
    
    // Check if we have reviews
    if (!result.reviews || result.reviews.length === 0) {
      console.log('No reviews found for this place');
      return NextResponse.json({
        success: true,
        averageRating: result.rating || 0,
        totalRatings: result.user_ratings_total || 0,
        reviews: [],
        message: 'No reviews available yet',
      });
    }

    // Format the reviews
    const formattedReviews = result.reviews.map((review: any, index: number) => ({
      id: review.time || index,
      name: review.author_name || 'Google User',
      rating: review.rating || 5,
      text: review.text || 'No review text',
      date: review.relative_time_description || new Date(review.time * 1000).toLocaleDateString(),
      profilePhoto: review.profile_photo_url || null,
      time: review.time,
    }));

    // Sort by time (newest first)
    const sortedReviews = formattedReviews.sort((a: any, b: any) => b.time - a.time);

    console.log(`Successfully fetched ${sortedReviews.length} real reviews`);

    return NextResponse.json({
      success: true,
      averageRating: result.rating || 0,
      totalRatings: result.user_ratings_total || 0,
      reviews: sortedReviews,
    });

  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
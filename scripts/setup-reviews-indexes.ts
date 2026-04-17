import {getClientPromise} from '@/lib/mongodb';

async function setupReviewsIndexes() {
  try {
    const client = await getClientPromise();
    const db = client.db('abmtours');
    const collection = db.collection('reviews');
    
    // Create indexes for better query performance
    await collection.createIndex({ createdAt: -1 }); // For sorting by newest
    await collection.createIndex({ rating: -1 }); // For sorting by highest rated
    await collection.createIndex({ verified: 1 }); // For filtering verified reviews
    await collection.createIndex({ date: -1 }); // For sorting by review date
    
    console.log('✅ Reviews indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

setupReviewsIndexes();
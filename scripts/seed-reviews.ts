import clientPromise from '@/lib/mongodb';

const sampleReviews = [
  {
    name: "Sarah Johnson",
    rating: 5,
    text: "Absolutely incredible experience! Our guide was knowledgeable and made sure we saw all the Big Five. The accommodations were top-notch and the service was impeccable. Highly recommend ABM Tours!",
    date: "2024-03-15T00:00:00.000Z",
    profileImage: null,
    verified: true,
    tripType: "Safari",
    destination: "Serengeti",
    helpful: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Michael Chen",
    rating: 5,
    text: "The Zanzibar beach holiday was exactly what we needed. Perfect organization, beautiful resorts, and amazing service. The team took care of everything!",
    date: "2024-02-20T00:00:00.000Z",
    profileImage: null,
    verified: true,
    tripType: "Beach",
    destination: "Zanzibar",
    helpful: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Emma Williams",
    rating: 4,
    text: "Great safari experience! Saw amazing wildlife and the guides were very professional. Only minor issue was the early morning starts, but that's part of the adventure!",
    date: "2024-01-10T00:00:00.000Z",
    profileImage: null,
    verified: true,
    tripType: "Safari",
    destination: "Ngorongoro",
    helpful: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seedReviews() {
  try {
    const client = await clientPromise;
    const db = client.db('abmtours');
    const collection = db.collection('reviews');
    
    // Clear existing reviews
    await collection.deleteMany({});
    console.log('Cleared existing reviews');
    
    // Insert sample reviews
    const result = await collection.insertMany(sampleReviews);
    console.log(`✅ Seeded ${result.insertedCount} reviews`);
    
  } catch (error) {
    console.error('Error seeding reviews:', error);
  }
}

seedReviews();
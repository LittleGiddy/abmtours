import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!uri) {
  throw new Error('❌ MongoDB URI is not set in environment variables.');
}

const options = {
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 30000,
  tls: true,
  tlsAllowInvalidCertificates: true,
  tlsAllowInvalidHostnames: true,
  retryWrites: true,
  retryReads: true,
  maxPoolSize: 1,
  minPoolSize: 0,
  maxIdleTimeMS: 10000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare const global: typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

// Skip MongoDB connection during build time on Vercel
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                    process.env.VERCEL_ENV === 'preview' && !process.env.VERCEL_URL;

if (isBuildTime) {
  // Return a dummy promise during build
  clientPromise = Promise.resolve({} as MongoClient);
} else if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
}

export default clientPromise;
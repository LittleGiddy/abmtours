import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!uri) {
  throw new Error(
    '❌ MongoDB URI is not set in environment variables.\n' +
    'Please add MONGODB_URI to your .env.local file'
  );
}

const options = {
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Use a type declaration for global
declare const global: typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable so the connection
  // is preserved across module reloads caused by HMR
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new connection
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
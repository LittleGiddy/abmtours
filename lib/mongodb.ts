import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const options = {
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 10000,
};

declare const global: typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

export function getClientPromise(): Promise<MongoClient> {
  if (!uri) throw new Error('Please define MONGODB_URI environment variable');

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  }

  const client = new MongoClient(uri, options);
  return client.connect();
}

export default getClientPromise;
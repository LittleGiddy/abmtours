import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
const options = {};

if (!uri) {
  throw new Error('MONGO_URI is not defined in environment variables');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Extend global to cache the Mongo client promise in development
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

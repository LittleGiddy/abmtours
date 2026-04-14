import { MongoClient } from 'mongodb';

// Use a single source of truth for the URI
const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    '❌ Please define the MONGODB_URI environment variable in .env.local\n' +
    'Example: MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/abmtours'
  );
}

const options = {
  // Add reasonable timeouts for better error handling
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so the connection
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().catch(err => {
      console.error('❌ MongoDB connection failed:', err);
      throw err;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect().catch(err => {
    console.error('❌ MongoDB connection failed:', err);
    throw err;
  });
}

export default clientPromise;
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = {
    conn: null,
    promise: null,
  };
}

export const connectToDatabase = async () => {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI must be set inside .env");
  }

  // Return existing connection
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection promise if it doesn't exist
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  // Avoid logging sensitive URI
  console.log(`Connected to database (${process.env.NODE_ENV})`);

  // IMPORTANT: return the connection
  return cached.conn;
};

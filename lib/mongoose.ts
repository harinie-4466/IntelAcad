// lib/mongoose.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

/**
 * Prevent creating multiple connections during Next.js hot reload in development.
 */
let cached: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} = (global as any)._mongooseCache || { conn: null, promise: null };

if (!cached.promise) {
  const opts = {
    bufferCommands: false,
    // set other mongoose options if needed
  };

  cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
    return mongooseInstance;
  });
  (global as any)._mongooseCache = cached;
}

export default async function dbConnect() {
  if (cached.conn) return cached.conn;
  cached.conn = await cached.promise!;
  return cached.conn;
}

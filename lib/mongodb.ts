import mongoose from 'mongoose';
import { env } from './env';

const MONGODB_URI = env.MONGODB_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
    var mongoose: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
}

if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB
 * @returns Mongoose instance
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
    if (global.mongoose.conn) {
        return global.mongoose.conn;
    }

    if (!global.mongoose.promise) {
        const opts = {
            bufferCommands: false,
        };

        global.mongoose.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        global.mongoose.conn = await global.mongoose.promise;
    } catch (e) {
        global.mongoose.promise = null;
        throw e;
    }

    return global.mongoose.conn;
}

/**
 * Disconnect from MongoDB
 * Useful for testing
 */
export async function disconnectFromDatabase(): Promise<void> {
    if (global.mongoose.conn) {
        await global.mongoose.conn.disconnect();
        global.mongoose.conn = null;
        global.mongoose.promise = null;
    }
}
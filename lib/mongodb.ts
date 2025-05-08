import mongoose from 'mongoose';
import { env } from '@/lib/env';

const MONGODB_URI = env.MONGODB_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
    // eslint-disable-next-line no-var
    var mongoose: {
        conn: mongoose.Mongoose | null;
        promise: Promise<mongoose.Mongoose> | null;
    };
}

if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB
 */
export async function connectToDatabase(): Promise<void> {
    if (global.mongoose.conn) {
        return;
    }

    if (!global.mongoose.promise) {
        const opts = {
            bufferCommands: false,
        };

        global.mongoose.promise = mongoose.connect(MONGODB_URI, opts);
    }

    try {
        global.mongoose.conn = await global.mongoose.promise;
    } catch (e) {
        global.mongoose.promise = null;
        throw e;
    }
}

/**
 * Disconnect from MongoDB
 * Useful for testing
 */
export async function disconnectFromDatabase(): Promise<void> {
    if (global.mongoose.conn) {
        await mongoose.disconnect();
        global.mongoose.conn = null;
        global.mongoose.promise = null;
    }
}

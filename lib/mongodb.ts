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
        cache: Map<string, { data: any; expiry: number }>;
    };
}

if (!global.mongoose) {
    global.mongoose = {
        conn: null,
        promise: null,
        cache: new Map()
    };
}

/**
 * Connect to MongoDB with optimized connection options
 */
export async function connectToDatabase(): Promise<void> {
    if (global.mongoose.conn) {
        return;
    }

    if (!global.mongoose.promise) {
        const opts = {
            bufferCommands: false,
            maxPoolSize: 10, // Optimize connection pool size
            minPoolSize: 5,   // Maintain minimum connections
            socketTimeoutMS: 45000, // Longer socket timeout
            connectTimeoutMS: 10000, // Connection timeout
            serverSelectionTimeoutMS: 10000, // Server selection timeout
            heartbeatFrequencyMS: 10000, // Heartbeat frequency
        };

        global.mongoose.promise = mongoose.connect(MONGODB_URI, opts);
    }

    try {
        global.mongoose.conn = await global.mongoose.promise;

        // Connection is established with optimized settings
        // Read preference is set in the connection options
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
        global.mongoose.cache.clear();
    }
}

/**
 * Cache query results with TTL
 * @param key - Cache key
 * @param data - Data to cache
 * @param ttl - Time to live in milliseconds (default: 60 seconds)
 */
export function cacheData(key: string, data: any, ttl: number = 60000): void {
    const expiry = Date.now() + ttl;
    global.mongoose.cache.set(key, { data, expiry });
}

/**
 * Get cached data if not expired
 * @param key - Cache key
 * @returns Cached data or null if expired/not found
 */
export function getCachedData(key: string): any | null {
    const cached = global.mongoose.cache.get(key);

    if (!cached) return null;

    if (cached.expiry < Date.now()) {
        global.mongoose.cache.delete(key);
        return null;
    }

    return cached.data;
}

/**
 * Clear specific cache entry
 * @param key - Cache key to clear
 */
export function clearCache(key: string): void {
    global.mongoose.cache.delete(key);
}

/**
 * Clear all cache entries
 */
export function clearAllCache(): void {
    global.mongoose.cache.clear();
}

/**
 * Generate a cache key from query parameters
 * @param model - Model name
 * @param query - Query object
 * @param options - Additional options (sort, limit, etc.)
 * @returns Cache key string
 */
export function generateCacheKey(model: string, query: any, options: any = {}): string {
    return `${model}:${JSON.stringify(query)}:${JSON.stringify(options)}`;
}

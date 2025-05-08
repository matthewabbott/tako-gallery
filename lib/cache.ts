'use client';

/**
 * Client-side cache implementation
 * This file contains only client-side caching logic with no server dependencies
 */

// Global cache for client-side data
const clientCache = new Map<string, { data: any; expiry: number }>();

/**
 * Cache data with TTL
 * @param key - Cache key
 * @param data - Data to cache
 * @param ttl - Time to live in milliseconds (default: 60 seconds)
 */
export function cacheData(key: string, data: any, ttl: number = 60000): void {
    const expiry = Date.now() + ttl;
    clientCache.set(key, { data, expiry });
}

/**
 * Get cached data if not expired
 * @param key - Cache key
 * @returns Cached data or null if expired/not found
 */
export function getCachedData(key: string): any | null {
    const cached = clientCache.get(key);

    if (!cached) return null;

    if (cached.expiry < Date.now()) {
        clientCache.delete(key);
        return null;
    }

    return cached.data;
}

/**
 * Clear specific cache entry
 * @param key - Cache key to clear
 */
export function clearCache(key: string): void {
    clientCache.delete(key);
}

/**
 * Clear all cache entries
 */
export function clearAllCache(): void {
    clientCache.clear();
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

// Periodically clean expired cache entries
if (typeof window !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        clientCache.forEach((value, key) => {
            if (value.expiry < now) {
                clientCache.delete(key);
            }
        });
    }, 60000); // Clean every minute
}

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

// Define the cache structure
export interface PreloadCache {
    cards: Map<string, any>;
    pages: Map<string, any>;
    images: Set<string>;
    iframes: Set<string>;
}

// Create a singleton cache that persists across component renders
let globalCache: PreloadCache | null = null;

// Initialize the global cache if it doesn't exist
const getGlobalCache = (): PreloadCache => {
    if (!globalCache) {
        globalCache = {
            cards: new Map(),
            pages: new Map(),
            images: new Set(),
            iframes: new Set(),
        };
    }
    return globalCache;
};

export function usePreloadCache() {
    const cache = useRef<PreloadCache>(getGlobalCache());

    // Preload a card's data
    const preloadCard = useCallback((cardId: string, data: any) => {
        cache.current.cards.set(cardId, {
            data,
            timestamp: Date.now(),
        });
    }, []);

    // Get preloaded card data
    const getPreloadedCard = useCallback((cardId: string) => {
        const cachedCard = cache.current.cards.get(cardId);
        if (!cachedCard) return null;

        // Check if cache is still valid (10 minutes)
        const isValid = Date.now() - cachedCard.timestamp < 10 * 60 * 1000;
        if (!isValid) {
            cache.current.cards.delete(cardId);
            return null;
        }

        return cachedCard.data;
    }, []);

    // Preload a page of results
    const preloadPage = useCallback((cacheKey: string, data: any) => {
        cache.current.pages.set(cacheKey, {
            data,
            timestamp: Date.now(),
        });
    }, []);

    // Get preloaded page data
    const getPreloadedPage = useCallback((cacheKey: string) => {
        const cachedPage = cache.current.pages.get(cacheKey);
        if (!cachedPage) return null;

        // Check if cache is still valid (5 minutes)
        const isValid = Date.now() - cachedPage.timestamp < 5 * 60 * 1000;
        if (!isValid) {
            cache.current.pages.delete(cacheKey);
            return null;
        }

        return cachedPage.data;
    }, []);

    // Preload an image
    const preloadImage = useCallback((url: string) => {
        if (!url || cache.current.images.has(url)) return;

        cache.current.images.add(url);

        // Create an image element to preload
        const img = new Image();
        img.src = url;
    }, []);

    // Preload an iframe
    const preloadIframe = useCallback((url: string) => {
        if (!url || cache.current.iframes.has(url)) return;

        cache.current.iframes.add(url);

        // Use a hidden iframe to preload content
        if (typeof document !== 'undefined') {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = url;
            document.body.appendChild(iframe);

            // Remove the iframe after a short delay
            setTimeout(() => {
                try {
                    document.body.removeChild(iframe);
                } catch (e) {
                    // Ignore errors if iframe was already removed
                }
            }, 3000);
        }
    }, []);

    // Clear expired cache entries
    const cleanCache = useCallback(() => {
        const now = Date.now();

        // Clean cards cache (10 minutes TTL)
        cache.current.cards.forEach((value, key) => {
            if (now - value.timestamp > 10 * 60 * 1000) {
                cache.current.cards.delete(key);
            }
        });

        // Clean pages cache (5 minutes TTL)
        cache.current.pages.forEach((value, key) => {
            if (now - value.timestamp > 5 * 60 * 1000) {
                cache.current.pages.delete(key);
            }
        });
    }, []);

    // Periodically clean the cache
    useEffect(() => {
        const interval = setInterval(cleanCache, 60 * 1000); // Clean every minute
        return () => clearInterval(interval);
    }, [cleanCache]);

    return {
        preloadCard,
        getPreloadedCard,
        preloadPage,
        getPreloadedPage,
        preloadImage,
        preloadIframe,
    };
}

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePreloadCache } from './usePreloadCache';
import { generateCacheKey, getCachedData, cacheData } from '@/lib/cache';

export interface CardSource {
    source_name: string;
    source_description: string;
    source_index: string;
    url: string;
}

export interface CardMethodology {
    methodology_name: string;
    methodology_description: string;
}

export interface Card {
    id: string;
    cardId: string;
    title: string;
    description: string;
    webpageUrl: string;
    imageUrl: string;
    embedUrl: string;
    sources?: CardSource[];
    methodologies?: CardMethodology[];
    sourceIndexes?: string[];
    query: string;
    createdAt: string;
}

export interface Pagination {
    page: number;
    limit: number;
    totalCards: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface Collection {
    username: string;
    createdAt: string;
}

export interface CardsResponse {
    cards: Card[];
    pagination: Pagination;
    collection: Collection;
}

interface UseCardsProps {
    username: string;
    initialPage?: number;
    limit?: number;
    search?: string;
    fields?: string; // Optional fields to include in the response
}

export function useCards({
    username,
    initialPage = 1,
    limit = 12,
    search = '',
    fields = ''
}: UseCardsProps) {
    const [cards, setCards] = useState<Card[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [collection, setCollection] = useState<Collection | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(initialPage);
    const [searchQuery, setSearchQuery] = useState(search);

    // Track if component is mounted
    const isMounted = useRef(true);

    // Get preload cache functions
    const { preloadPage, getPreloadedPage, preloadImage } = usePreloadCache();

    // Prefetch controller to abort previous prefetch requests
    const prefetchControllerRef = useRef<AbortController | null>(null);

    // Function to fetch cards with caching
    const fetchCards = useCallback(async (
        pageNum: number,
        searchTerm: string,
        abortSignal?: AbortSignal,
        isPrefetch = false
    ) => {
        // Generate cache key
        const cacheKey = generateCacheKey('cards', {
            username,
            page: pageNum,
            limit,
            search: searchTerm,
            fields
        });

        // Check client-side cache first (for prefetching)
        const clientCachedData = getPreloadedPage(cacheKey);
        if (clientCachedData && isPrefetch) {
            return clientCachedData;
        }

        // Check server-side cache (for main requests)
        const cachedData = getCachedData(cacheKey);
        if (cachedData && !isPrefetch) {
            if (isMounted.current) {
                setCards(cachedData.cards);
                setPagination(cachedData.pagination);
                setCollection(cachedData.collection);
            }
            return cachedData;
        }

        // Build query parameters
        const queryParams = new URLSearchParams({
            username,
            page: pageNum.toString(),
            limit: limit.toString(),
        });

        if (searchTerm) {
            queryParams.append('search', searchTerm);
        }

        if (fields) {
            queryParams.append('fields', fields);
        }

        try {
            // Set fetch options
            const fetchOptions: RequestInit = {};
            if (abortSignal) {
                fetchOptions.signal = abortSignal;
            }

            // Set priority for prefetch requests
            if (isPrefetch) {
                // @ts-ignore - priority is a valid option but not in TypeScript types yet
                fetchOptions.priority = 'low';
            }

            const response = await fetch(`/api/cards?${queryParams.toString()}`, fetchOptions);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch cards');
            }

            const responseData = data.data;

            // Store in client-side cache
            preloadPage(cacheKey, responseData);

            // If this is the main request (not prefetch), update state
            if (!isPrefetch && isMounted.current) {
                setCards(responseData.cards);
                setPagination(responseData.pagination);
                setCollection(responseData.collection);

                // Preload card images
                responseData.cards.forEach((card: Card) => {
                    if (card.imageUrl) {
                        preloadImage(card.imageUrl);
                    }
                });
            }

            return responseData;
        } catch (error) {
            // Only set error state for main requests, not prefetch
            if (!isPrefetch && isMounted.current) {
                console.error('Error fetching cards:', error);
                setError(error instanceof Error ? error.message : 'An error occurred');
            } else if (isPrefetch) {
                // Silently log prefetch errors
                console.debug('Background prefetch failed:', error);
            }
            return null;
        }
    }, [username, limit, fields, preloadPage, getPreloadedPage, preloadImage]);

    // Fetch cards when username, page, or search changes
    useEffect(() => {
        if (!username) return;

        const loadCards = async () => {
            setLoading(true);
            setError(null);

            await fetchCards(page, searchQuery);

            setLoading(false);
        };

        loadCards();

        // Cleanup function
        return () => {
            isMounted.current = false;

            // Abort any ongoing prefetch
            if (prefetchControllerRef.current) {
                prefetchControllerRef.current.abort();
                prefetchControllerRef.current = null;
            }
        };
    }, [username, page, limit, searchQuery, fetchCards]);

    // Set mounted ref on mount
    useEffect(() => {
        isMounted.current = true;

        return () => {
            isMounted.current = false;
        };
    }, []);

    // Function to handle search
    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        setPage(1); // Reset to first page when searching
    }, []);

    // Function to handle page change
    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage);
    }, []);

    // Function to prefetch the next page
    const prefetchNextPage = useCallback(async () => {
        if (!pagination || !pagination.hasNextPage) return;

        // Abort previous prefetch if exists
        if (prefetchControllerRef.current) {
            prefetchControllerRef.current.abort();
        }

        // Create new abort controller
        const controller = new AbortController();
        prefetchControllerRef.current = controller;

        // Set timeout to abort if it takes too long
        const timeoutId = setTimeout(() => {
            if (prefetchControllerRef.current === controller) {
                controller.abort();
                prefetchControllerRef.current = null;
            }
        }, 8000); // 8s timeout

        try {
            // Prefetch next page
            await fetchCards(pagination.page + 1, searchQuery, controller.signal, true);
        } finally {
            clearTimeout(timeoutId);

            // Clear controller reference if it's still this one
            if (prefetchControllerRef.current === controller) {
                prefetchControllerRef.current = null;
            }
        }
    }, [pagination, searchQuery, fetchCards]);

    // Function to prefetch a specific card's details
    const prefetchCardDetails = useCallback((cardId: string) => {
        // This would be implemented in a separate hook for card details
        // But we can preload the card's image here
        const card = cards.find(c => c.id === cardId || c.cardId === cardId);
        if (card && card.imageUrl) {
            preloadImage(card.imageUrl);
        }
    }, [cards, preloadImage]);

    return {
        cards,
        pagination,
        collection,
        loading,
        error,
        page,
        searchQuery,
        handleSearch,
        handlePageChange,
        prefetchNextPage,
        prefetchCardDetails,
    };
}

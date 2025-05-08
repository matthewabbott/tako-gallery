'use client';

import { useState, useEffect } from 'react';

export interface SampleCard {
    id: string;
    cardId: string;
    title: string;
    imageUrl: string;
    createdAt: string;
}

export interface Collection {
    username: string;
    createdAt: string;
    cardCount: number;
    sampleCards: SampleCard[];
}

export interface Pagination {
    page: number;
    limit: number;
    totalCollections: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface CollectionsResponse {
    collections: Collection[];
    pagination: Pagination;
}

interface UseCollectionsProps {
    initialPage?: number;
    limit?: number;
    search?: string;
}

export function useCollections({ initialPage = 1, limit = 10, search = '' }: UseCollectionsProps = {}) {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(initialPage);
    const [searchQuery, setSearchQuery] = useState(search);

    // Fetch collections when page or search changes
    useEffect(() => {
        const fetchCollections = async () => {
            setLoading(true);
            setError(null);

            try {
                const queryParams = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                });

                if (searchQuery) {
                    queryParams.append('search', searchQuery);
                }

                const response = await fetch(`/api/collections?${queryParams.toString()}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch collections');
                }

                setCollections(data.data.collections);
                setPagination(data.data.pagination);
            } catch (error) {
                console.error('Error fetching collections:', error);
                setError(error instanceof Error ? error.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchCollections();
    }, [page, limit, searchQuery]);

    // Function to handle search
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setPage(1); // Reset to first page when searching
    };

    // Function to handle page change
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return {
        collections,
        pagination,
        loading,
        error,
        page,
        searchQuery,
        handleSearch,
        handlePageChange,
    };
}

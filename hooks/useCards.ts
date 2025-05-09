'use client';

import { useState, useEffect } from 'react';

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
}

export function useCards({ username, initialPage = 1, limit = 12, search = '' }: UseCardsProps) {
    const [cards, setCards] = useState<Card[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [collection, setCollection] = useState<Collection | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(initialPage);
    const [searchQuery, setSearchQuery] = useState(search);

    // Fetch cards when username, page, or search changes
    useEffect(() => {
        if (!username) return;

        const fetchCards = async () => {
            setLoading(true);
            setError(null);

            try {
                const queryParams = new URLSearchParams({
                    username,
                    page: page.toString(),
                    limit: limit.toString(),
                });

                if (searchQuery) {
                    queryParams.append('search', searchQuery);
                }

                const response = await fetch(`/api/cards?${queryParams.toString()}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch cards');
                }

                setCards(data.data.cards);
                setPagination(data.data.pagination);
                setCollection(data.data.collection);
            } catch (error) {
                console.error('Error fetching cards:', error);
                setError(error instanceof Error ? error.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchCards();
    }, [username, page, limit, searchQuery]);

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
        cards,
        pagination,
        collection,
        loading,
        error,
        page,
        searchQuery,
        handleSearch,
        handlePageChange,
    };
}

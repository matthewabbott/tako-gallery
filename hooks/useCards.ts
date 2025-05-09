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
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Function to manually trigger a refresh of the cards data
    const refreshCards = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    // Function to add a new card directly to the local state
    const addCard = (newCard: Card) => {
        setCards(prevCards => {
            // Check if the card already exists in the array
            const exists = prevCards.some(card => card.cardId === newCard.cardId);
            if (exists) {
                return prevCards; // Don't add duplicate cards
            }
            // Add the new card at the beginning of the array (assuming newest first)
            return [newCard, ...prevCards];
        });

        // Update pagination if it exists
        if (pagination) {
            setPagination({
                ...pagination,
                totalCards: pagination.totalCards + 1,
                totalPages: Math.ceil((pagination.totalCards + 1) / pagination.limit)
            });
        }
    };

    // Fetch cards when username, page, search, or refreshTrigger changes
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
    }, [username, page, limit, searchQuery, refreshTrigger]);

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
        refreshCards,
        addCard,
    };
}

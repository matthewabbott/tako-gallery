'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card } from './useCards';

export type SortField = 'createdAt' | 'title' | 'query';
export type SortOrder = 'asc' | 'desc';

interface UseCollectionSearchProps {
    cards: Card[];
    initialSearch?: string;
    initialSortField?: SortField;
    initialSortOrder?: SortOrder;
    enableClientSideFiltering?: boolean;
}

interface UseCollectionSearchResult {
    filteredCards: Card[];
    searchQuery: string;
    sortField: SortField;
    sortOrder: SortOrder;
    setSearchQuery: (query: string) => void;
    setSortField: (field: SortField) => void;
    setSortOrder: (order: SortOrder) => void;
    resetFilters: () => void;
}

export function useCollectionSearch({
    cards,
    initialSearch = '',
    initialSortField = 'createdAt',
    initialSortOrder = 'desc',
    enableClientSideFiltering = true,
}: UseCollectionSearchProps): UseCollectionSearchResult {
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [sortField, setSortField] = useState<SortField>(initialSortField);
    const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder);

    // Filter and sort cards client-side if enabled
    const filteredCards = useMemo(() => {
        if (!enableClientSideFiltering || !cards) return cards;

        // Filter cards based on search query
        let filtered = cards;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = cards.filter(
                card =>
                    card.title.toLowerCase().includes(query) ||
                    card.description.toLowerCase().includes(query) ||
                    card.query.toLowerCase().includes(query)
            );
        }

        // Sort cards based on sort field and order
        return [...filtered].sort((a, b) => {
            let comparison = 0;

            // Handle different sort fields
            if (sortField === 'createdAt') {
                comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            } else if (sortField === 'title') {
                comparison = a.title.localeCompare(b.title);
            } else if (sortField === 'query') {
                comparison = a.query.localeCompare(b.query);
            }

            // Apply sort order
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    }, [cards, searchQuery, sortField, sortOrder, enableClientSideFiltering]);

    // Reset filters to initial values
    const resetFilters = () => {
        setSearchQuery('');
        setSortField(initialSortField);
        setSortOrder(initialSortOrder);
    };

    return {
        filteredCards,
        searchQuery,
        sortField,
        sortOrder,
        setSearchQuery,
        setSortField,
        setSortOrder,
        resetFilters,
    };
}

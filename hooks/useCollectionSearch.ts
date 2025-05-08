'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card } from './useCards';

export type SortField = 'createdAt' | 'title' | 'query' | 'sourcesCount' | 'methodologiesCount';
export type SortOrder = 'asc' | 'desc';

interface UseCollectionSearchProps {
    cards: Card[];
    initialSearch?: string;
    initialSortField?: SortField;
    initialSortOrder?: SortOrder;
    sourceFilter?: string;
    sourceIndexFilter?: string;
    methodologyFilter?: string;
    enableClientSideFiltering?: boolean;
}

interface UseCollectionSearchResult {
    filteredCards: Card[];
    searchQuery: string;
    sortField: SortField;
    sortOrder: SortOrder;
    sourceFilter: string;
    sourceIndexFilter: string;
    methodologyFilter: string;
    setSearchQuery: (query: string) => void;
    setSortField: (field: SortField) => void;
    setSortOrder: (order: SortOrder) => void;
    setSourceFilter: (filter: string) => void;
    setSourceIndexFilter: (filter: string) => void;
    setMethodologyFilter: (filter: string) => void;
    resetFilters: () => void;
}

export function useCollectionSearch({
    cards,
    initialSearch = '',
    initialSortField = 'createdAt',
    initialSortOrder = 'desc',
    sourceFilter: initialSourceFilter = '',
    sourceIndexFilter: initialSourceIndexFilter = '',
    methodologyFilter: initialMethodologyFilter = '',
    enableClientSideFiltering = true,
}: UseCollectionSearchProps): UseCollectionSearchResult {
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [sortField, setSortField] = useState<SortField>(initialSortField);
    const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder);
    const [sourceFilter, setSourceFilter] = useState(initialSourceFilter);
    const [sourceIndexFilter, setSourceIndexFilter] = useState(initialSourceIndexFilter);
    const [methodologyFilter, setMethodologyFilter] = useState(initialMethodologyFilter);

    // Filter and sort cards client-side if enabled
    const filteredCards = useMemo(() => {
        if (!enableClientSideFiltering || !cards) return cards;

        // Filter cards based on search query and Tako-specific filters
        let filtered = cards;

        // Apply text search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                card =>
                    card.title.toLowerCase().includes(query) ||
                    card.description.toLowerCase().includes(query) ||
                    card.query.toLowerCase().includes(query)
            );
        }

        // Apply source name filter
        if (sourceFilter) {
            const filter = sourceFilter.toLowerCase();
            filtered = filtered.filter(
                card => card.sources?.some(
                    source => source.source_name.toLowerCase().includes(filter)
                )
            );
        }

        // Apply source index filter
        if (sourceIndexFilter) {
            filtered = filtered.filter(
                card => card.sources?.some(
                    source => source.source_index === sourceIndexFilter
                )
            );
        }

        // Apply methodology filter
        if (methodologyFilter) {
            const filter = methodologyFilter.toLowerCase();
            filtered = filtered.filter(
                card => card.methodologies?.some(
                    methodology => methodology.methodology_name.toLowerCase().includes(filter)
                )
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
            } else if (sortField === 'sourcesCount') {
                comparison = (a.sources?.length || 0) - (b.sources?.length || 0);
            } else if (sortField === 'methodologiesCount') {
                comparison = (a.methodologies?.length || 0) - (b.methodologies?.length || 0);
            }

            // Apply sort order
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    }, [cards, searchQuery, sortField, sortOrder, sourceFilter, sourceIndexFilter, methodologyFilter, enableClientSideFiltering]);

    // Reset filters to initial values
    const resetFilters = () => {
        setSearchQuery('');
        setSortField(initialSortField);
        setSortOrder(initialSortOrder);
        setSourceFilter('');
        setSourceIndexFilter('');
        setMethodologyFilter('');
    };

    return {
        filteredCards,
        searchQuery,
        sortField,
        sortOrder,
        sourceFilter,
        sourceIndexFilter,
        methodologyFilter,
        setSearchQuery,
        setSortField,
        setSortOrder,
        setSourceFilter,
        setSourceIndexFilter,
        setMethodologyFilter,
        resetFilters,
    };
}

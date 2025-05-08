'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { CardItem } from '@/components/CardItem';
import { CardDetail } from '@/components/CardDetail';
import { Button } from './ui/Button';
import { Card, useCards } from '@/hooks/useCards';
import { CollectionSearch } from '@/components/CollectionSearch';
import { useCollectionSearch, SortField, SortOrder } from '@/hooks/useCollectionSearch';

interface CardGridProps {
    username: string;
    initialPage?: number;
    limit?: number;
    initialSearch?: string;
    initialSortField?: SortField;
    initialSortOrder?: SortOrder;
}

export function CardGrid({
    username,
    initialPage = 1,
    limit = 12,
    initialSearch = '',
    initialSortField = 'createdAt',
    initialSortOrder = 'desc'
}: CardGridProps) {
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [sortField, setSortField] = useState<SortField>(initialSortField);
    const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder);

    const {
        cards,
        pagination,
        collection,
        loading,
        error,
        handleSearch,
        handlePageChange,
        searchQuery,
    } = useCards({
        username,
        initialPage,
        limit,
        search: initialSearch,
    });

    // Use client-side filtering and sorting
    const {
        filteredCards,
        searchQuery: clientSearchQuery,
        sortField: clientSortField,
        sortOrder: clientSortOrder,
        setSearchQuery: setClientSearchQuery,
        setSortField: setClientSortField,
        setSortOrder: setClientSortOrder,
        resetFilters,
    } = useCollectionSearch({
        cards,
        initialSearch: searchQuery,
        initialSortField: sortField,
        initialSortOrder: sortOrder,
    });

    return (
        <div className="space-y-8">
            {/* Collection Header */}
            {collection && (
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{username}&apos;s Collection</h1>
                    <p className="text-gray-600">
                        Created {new Date(collection.createdAt).toLocaleDateString()}
                    </p>
                </div>
            )}

            {/* Collection Search */}
            <CollectionSearch
                searchQuery={clientSearchQuery}
                sortField={clientSortField}
                sortOrder={clientSortOrder}
                onSearchChange={(query) => {
                    setClientSearchQuery(query);
                    handleSearch(query);
                }}
                onSortFieldChange={setClientSortField}
                onSortOrderChange={setClientSortOrder}
                onReset={() => {
                    resetFilters();
                    handleSearch('');
                }}
            />

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-md">
                    <p className="font-medium">Error</p>
                    <p>{error}</p>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Loading cards...</span>
                </div>
            )}

            {/* Empty State */}
            {!loading && cards.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No cards found</h3>
                    <p className="text-gray-600 mb-4">
                        {clientSearchQuery
                            ? `No results found for "${clientSearchQuery}"`
                            : "This collection doesn't have any cards yet."}
                    </p>
                    {clientSearchQuery && (
                        <Button
                            onClick={() => {
                                setClientSearchQuery('');
                                handleSearch('');
                            }}
                            variant="outline"
                        >
                            Clear Search
                        </Button>
                    )}
                </div>
            )}

            {/* Card Grid */}
            {!loading && cards.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCards.map((card) => (
                        <CardItem
                            key={card.id}
                            card={card}
                            username={username}
                            onClick={() => setSelectedCard(card)}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-between items-center mt-8">
                    <div className="text-sm text-gray-600">
                        Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                        {Math.min(pagination.page * pagination.limit, pagination.totalCards)} of{' '}
                        {pagination.totalCards} cards
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={!pagination.hasPrevPage}
                            variant="outline"
                            size="sm"
                        >
                            Previous
                        </Button>
                        <span className="flex items-center px-3 py-1 text-sm">
                            Page {pagination.page} of {pagination.totalPages}
                        </span>
                        <Button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={!pagination.hasNextPage}
                            variant="outline"
                            size="sm"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Card Detail Modal */}
            {selectedCard && (
                <CardDetail
                    card={selectedCard}
                    isOpen={!!selectedCard}
                    onClose={() => setSelectedCard(null)}
                    username={username}
                />
            )}
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CardItem } from '@/components/CardItem';
import { CardDetail } from '@/components/CardDetail';
import { Button } from './ui/Button';
import { Card, useCards } from '@/hooks/useCards';
import { CollectionSearch } from '@/components/CollectionSearch';
import { useCollectionSearch, SortField, SortOrder } from '@/hooks/useCollectionSearch';
import { LoadingState, CardGridSkeleton } from '@/components/LoadingState';
import { ErrorDisplay } from '@/components/ErrorBoundary';

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
    const [sourceFilter, setSourceFilter] = useState('');
    const [sourceIndexFilter, setSourceIndexFilter] = useState('');
    const [methodologyFilter, setMethodologyFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [gridColumns, setGridColumns] = useState(getInitialGridColumns());

    // Determine initial grid columns based on screen size
    function getInitialGridColumns() {
        if (typeof window !== 'undefined') {
            const width = window.innerWidth;
            if (width >= 1280) return 4; // xl
            if (width >= 1024) return 3; // lg
            if (width >= 768) return 2; // md
            if (width >= 480) return 2; // xs
            return 1; // default
        }
        return 1;
    }

    // Update grid columns on window resize
    useEffect(() => {
        const handleResize = () => {
            setGridColumns(getInitialGridColumns());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
        sourceFilter,
        sourceIndexFilter,
        methodologyFilter,
    });

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Collection Header */}
            {collection && (
                <div className="mb-4 sm:mb-6">
                    <h1 className="text-2xl xs:text-3xl font-bold text-gray-900 mb-2">{username}&apos;s Collection</h1>
                    <p className="text-sm xs:text-base text-gray-600">
                        Created {new Date(collection.createdAt).toLocaleDateString()}
                    </p>
                </div>
            )}

            {/* Collection Search - Mobile Toggle */}
            <div className="md:hidden mb-4">
                <Button
                    onClick={() => setShowFilters(!showFilters)}
                    variant="outline"
                    className="w-full"
                >
                    {showFilters ? 'Hide Filters' : 'Show Filters & Sorting'}
                </Button>
            </div>

            {/* Collection Search - Responsive */}
            <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
                <CollectionSearch
                    searchQuery={clientSearchQuery}
                    sortField={clientSortField}
                    sortOrder={clientSortOrder}
                    sourceFilter={sourceFilter}
                    sourceIndexFilter={sourceIndexFilter}
                    methodologyFilter={methodologyFilter}
                    onSearchChange={(query) => {
                        setClientSearchQuery(query);
                        handleSearch(query);
                    }}
                    onSortFieldChange={setClientSortField}
                    onSortOrderChange={setClientSortOrder}
                    onSourceFilterChange={setSourceFilter}
                    onSourceIndexFilterChange={setSourceIndexFilter}
                    onMethodologyFilterChange={setMethodologyFilter}
                    onReset={() => {
                        resetFilters();
                        handleSearch('');
                    }}
                />
            </div>

            {/* Error Message */}
            {error && (
                <ErrorDisplay error={error} className="mb-6" />
            )}

            {/* Loading State */}
            {loading && (
                <div className="py-8 sm:py-12">
                    <LoadingState text="Loading cards..." size="lg" className="mb-8" />
                    <CardGridSkeleton columns={gridColumns} />
                </div>
            )}

            {/* Empty State */}
            {!loading && cards.length === 0 && (
                <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg px-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No cards found</h3>
                    <p className="text-gray-600 mb-4 text-sm sm:text-base">
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

            {/* Card Grid - Responsive with dynamic columns */}
            {!loading && cards.length > 0 && (
                <div className={`grid gap-3 xs:gap-4 sm:gap-5 lg:gap-6`}
                    style={{
                        gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`
                    }}
                >
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

            {/* Pagination - Responsive */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex flex-col xs:flex-row justify-between items-center mt-6 sm:mt-8 gap-4">
                    <div className="text-xs xs:text-sm text-gray-600 order-2 xs:order-1 text-center xs:text-left w-full xs:w-auto">
                        Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                        {Math.min(pagination.page * pagination.limit, pagination.totalCards)} of{' '}
                        {pagination.totalCards} cards
                    </div>
                    <div className="flex gap-2 order-1 xs:order-2 w-full xs:w-auto justify-center xs:justify-end">
                        <Button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={!pagination.hasPrevPage}
                            variant="outline"
                            size="sm"
                            className="px-3 py-1 h-9 min-w-[80px] sm:min-w-[100px]"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            <span className="hidden xs:inline">Previous</span>
                            <span className="xs:hidden">Prev</span>
                        </Button>
                        <span className="flex items-center px-2 xs:px-3 py-1 text-xs xs:text-sm bg-gray-50 rounded-md min-w-[80px] justify-center">
                            {pagination.page} / {pagination.totalPages}
                        </span>
                        <Button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={!pagination.hasNextPage}
                            variant="outline"
                            size="sm"
                            className="px-3 py-1 h-9 min-w-[80px] sm:min-w-[100px]"
                        >
                            <span>Next</span>
                            <ChevronRight className="h-4 w-4 ml-1" />
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

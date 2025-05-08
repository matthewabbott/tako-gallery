'use client';

import { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CardItem } from '@/components/CardItem';
import { CardDetail } from '@/components/CardDetail';
import { Button } from './ui/Button';
import { Card, useCards } from '@/hooks/useCards';
import { CollectionSearch } from '@/components/CollectionSearch';
import { CollectionHeader } from '@/components/CollectionHeader';
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

// Memoized CardItem component to prevent unnecessary re-renders
const MemoizedCardItem = memo(CardItem);

// Virtualized grid container for better performance with large lists
function VirtualizedGrid({
    cards,
    username,
    gridColumns,
    onCardClick,
    onCardHover
}: {
    cards: Card[],
    username: string,
    gridColumns: number,
    onCardClick: (card: Card) => void,
    onCardHover?: (index: number) => void
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
    const bufferSize = 8; // Number of additional items to render above/below viewport

    // Update visible range based on scroll position
    const updateVisibleRange = useCallback(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const containerRect = container.getBoundingClientRect();
        const containerTop = containerRect.top;
        const containerHeight = containerRect.height;
        const itemHeight = 320; // Approximate height of a card in pixels
        const rowHeight = itemHeight + 20; // Add gap
        const visibleRows = Math.ceil(containerHeight / rowHeight) + 1;

        // Calculate visible range with buffer
        const rowsPerScreen = Math.ceil(containerHeight / rowHeight);
        const startRow = Math.max(0, Math.floor(-containerTop / rowHeight) - bufferSize);
        const endRow = Math.min(
            Math.ceil(cards.length / gridColumns),
            Math.ceil((-containerTop + containerHeight) / rowHeight) + bufferSize
        );

        const start = Math.max(0, startRow * gridColumns);
        const end = Math.min(cards.length, endRow * gridColumns);

        setVisibleRange({ start, end });
    }, [cards.length, gridColumns, bufferSize]);

    // Set up intersection observer for scroll detection
    useEffect(() => {
        if (!containerRef.current) return;

        // Initial update
        updateVisibleRange();

        // Use Intersection Observer for better performance than scroll events
        const observer = new IntersectionObserver(updateVisibleRange, {
            root: null,
            rootMargin: '600px 0px',
            threshold: 0.1
        });

        observer.observe(containerRef.current);

        // Cleanup
        return () => observer.disconnect();
    }, [updateVisibleRange]);

    // Calculate total height to maintain scroll position
    const totalHeight = Math.ceil(cards.length / gridColumns) * 340; // Approximate row height
    const visibleCards = useMemo(() =>
        cards.slice(visibleRange.start, visibleRange.end),
        [cards, visibleRange]
    );

    return (
        <div
            ref={containerRef}
            className="overflow-y-auto"
            style={{ height: '100%', maxHeight: '80vh' }}
        >
            <div
                className={`grid gap-3 xs:gap-4 sm:gap-5 lg:gap-6`}
                style={{
                    gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
                    height: `${totalHeight}px`,
                    position: 'relative'
                }}
            >
                {visibleCards.map((card, i) => {
                    const actualIndex = visibleRange.start + i;
                    const rowIndex = Math.floor(actualIndex / gridColumns);
                    const colIndex = actualIndex % gridColumns;

                    return (
                        <div
                            key={card.id}
                            style={{
                                position: 'absolute',
                                top: `${rowIndex * 340}px`, // Approximate positioning
                                left: `${colIndex * (100 / gridColumns)}%`,
                                width: `calc(${100 / gridColumns}% - 20px)`,
                            }}
                        >
                            <MemoizedCardItem
                                card={card}
                                username={username}
                                onClick={() => onCardClick(card)}
                                onHover={() => onCardHover && onCardHover(actualIndex)}
                                priority={actualIndex < 8} // Prioritize first 8 cards
                                index={actualIndex}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Memoized virtualized grid
const MemoizedVirtualizedGrid = memo(VirtualizedGrid);

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
    const [useVirtualization, setUseVirtualization] = useState(false);

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

    // Update grid columns on window resize - debounced for performance
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setGridColumns(getInitialGridColumns());
            }, 100); // 100ms debounce
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeoutId);
        };
    }, []);

    // Fetch cards data with optimized hook
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

    // Use client-side filtering and sorting with memoization
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

    // Enable virtualization for large card sets
    useEffect(() => {
        setUseVirtualization(filteredCards.length > 24);
    }, [filteredCards.length]);

    // Get prefetch function from useCards hook
    const { prefetchNextPage, prefetchCardDetails } = useCards({
        username,
        initialPage,
        limit,
        search: initialSearch,
    });

    // Memoized handlers to prevent unnecessary re-renders
    const handleCardClick = useCallback((card: Card) => {
        setSelectedCard(card);
    }, []);

    const handleCloseDetail = useCallback(() => {
        setSelectedCard(null);
    }, []);

    const handleToggleFilters = useCallback(() => {
        setShowFilters(prev => !prev);
    }, []);

    const handleResetSearch = useCallback(() => {
        setClientSearchQuery('');
        handleSearch('');
    }, [setClientSearchQuery, handleSearch]);

    // Handle scroll to prefetch next page
    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        const scrollPosition = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;

        // If user scrolled past 70% of the content, prefetch next page
        if (scrollPosition > (scrollHeight - clientHeight) * 0.7) {
            prefetchNextPage();
        }
    }, [prefetchNextPage]);

    // Preload adjacent cards when a card is hovered
    const handleCardHover = useCallback((index: number) => {
        // Prefetch the card details
        const card = filteredCards[index];
        if (card) {
            prefetchCardDetails(card.id);
        }

        // Preload cards that are likely to be viewed next (adjacent cards)
        const adjacentIndices = [index - 1, index + 1, index - gridColumns, index + gridColumns];

        adjacentIndices.forEach(idx => {
            if (idx >= 0 && idx < filteredCards.length) {
                const adjacentCard = filteredCards[idx];
                prefetchCardDetails(adjacentCard.id);
            }
        });
    }, [filteredCards, gridColumns, prefetchCardDetails]);

    // Memoized collection header to prevent re-renders
    const collectionHeader = useMemo(() => {
        if (!collection) return null;

        return (
            <CollectionHeader
                username={username}
                createdAt={collection.createdAt}
                cardCount={pagination?.totalCards || 0}
            />
        );
    }, [collection, username, pagination?.totalCards]);

    // Memoized pagination component
    const paginationComponent = useMemo(() => {
        if (!pagination || pagination.totalPages <= 1) return null;

        return (
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
        );
    }, [pagination, handlePageChange]);

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Collection Header */}
            {collectionHeader}

            {/* Collection Search - Mobile Toggle */}
            <div className="md:hidden mb-4">
                <Button
                    onClick={handleToggleFilters}
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
                            onClick={handleResetSearch}
                            variant="outline"
                        >
                            Clear Search
                        </Button>
                    )}
                </div>
            )}

            {/* Card Grid - Choose between virtualized or standard grid based on card count */}
            {!loading && filteredCards.length > 0 && (
                <>
                    {useVirtualization ? (
                        <div style={{ height: '70vh', minHeight: '500px' }}>
                            <MemoizedVirtualizedGrid
                                cards={filteredCards}
                                username={username}
                                gridColumns={gridColumns}
                                onCardClick={handleCardClick}
                                onCardHover={handleCardHover}
                            />
                        </div>
                    ) : (
                        <div
                            className={`grid gap-3 xs:gap-4 sm:gap-5 lg:gap-6 overflow-auto`}
                            style={{
                                gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`
                            }}
                            onScroll={handleScroll}
                        >
                            {filteredCards.map((card, index) => (
                                <MemoizedCardItem
                                    key={card.id}
                                    card={card}
                                    username={username}
                                    onClick={() => handleCardClick(card)}
                                    onHover={() => handleCardHover(index)}
                                    priority={index < 8} // Prioritize first 8 cards
                                    index={index}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Pagination - Responsive */}
            {paginationComponent}

            {/* Card Detail Modal */}
            {selectedCard && (
                <CardDetail
                    card={selectedCard}
                    isOpen={!!selectedCard}
                    onClose={handleCloseDetail}
                    username={username}
                />
            )}
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
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
    initialCardId?: string;
}

export function CardGrid({
    username,
    initialPage = 1,
    limit = 12,
    initialSearch = '',
    initialSortField = 'createdAt',
    initialSortOrder = 'desc',
    initialCardId
}: CardGridProps) {
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
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
        addCard,
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

    // Handle URL updates when a card is selected or closed
    const updateUrl = (cardId?: string) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));

        if (cardId) {
            current.set('cardId', cardId);
        } else {
            current.delete('cardId');
        }

        const search = current.toString();
        const query = search ? `?${search}` : '';

        router.replace(`${pathname}${query}`, { scroll: false });
    };

    // Handle card selection
    const handleCardSelect = (card: Card) => {
        setSelectedCard(card);
        updateUrl(card.cardId);
    };

    // Handle card modal close
    const handleCardClose = () => {
        setSelectedCard(null);
        updateUrl();
    };

    // Load card from URL parameter on initial render
    useEffect(() => {
        if (initialCardId && cards.length > 0) {
            const card = cards.find(c => c.cardId === initialCardId);
            if (card) {
                setSelectedCard(card);
            }
        }
    }, [initialCardId, cards]);

    // Listen for URL changes
    useEffect(() => {
        const cardId = searchParams.get('cardId');
        if (cardId && cards.length > 0) {
            const card = cards.find(c => c.cardId === cardId);
            if (card) {
                setSelectedCard(card);
            } else {
                // If the card isn't found in the current cards array,
                // we might need to fetch it individually
                const fetchSingleCard = async () => {
                    try {
                        const response = await fetch(`/api/cards/${cardId}?username=${username}`);
                        const data = await response.json();

                        if (response.ok && data.data.card) {
                            // Add the card to the local state
                            const newCard = data.data.card;
                            // Add the card directly to the local state using the addCard function
                            addCard(newCard);
                            // Set it as the selected card
                            setSelectedCard(newCard);
                        }
                    } catch (error) {
                        console.error('Error fetching single card:', error);
                    }
                };

                fetchSingleCard();
            }
        } else if (!cardId) {
            // Clear selected card if no cardId in URL
            setSelectedCard(null);
        }
    }, [searchParams, cards, username, addCard]);

    return (
        <div className="space-y-6 sm:space-y-8">
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
                <div className="text-center py-8 sm:py-12 bg-gray-50 dark:bg-slate-800 rounded-lg px-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">No cards found</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
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
                            onClick={() => handleCardSelect(card)}
                        />
                    ))}
                </div>
            )}

            {/* Pagination - Responsive */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex flex-col xs:flex-row justify-between items-center mt-6 sm:mt-8 gap-4">
                    <div className="text-xs xs:text-sm text-gray-600 dark:text-gray-400 order-2 xs:order-1 text-center xs:text-left w-full xs:w-auto">
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
                        <span className="flex items-center px-2 xs:px-3 py-1 text-xs xs:text-sm bg-gray-50 dark:bg-slate-700 rounded-md min-w-[80px] justify-center">
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
                    onClose={handleCardClose}
                    username={username}
                />
            )}
        </div>
    );
}

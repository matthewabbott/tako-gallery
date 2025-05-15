'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { CollectionCard } from '@/components/CollectionCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useCollections } from '@/hooks/useCollections';
import { ErrorDisplay } from '@/components/ErrorBoundary';
import { LoadingState } from '@/components/LoadingState';

export default function ExplorePage() {
    const [searchInput, setSearchInput] = useState('');

    const {
        collections,
        pagination,
        loading,
        error,
        handleSearch,
        handlePageChange,
    } = useCollections();

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch(searchInput);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-tako-dark-text-primary mb-6">Explore Collections</h1>

                {/* Search Bar */}
                <div className="mb-8">
                    <form onSubmit={handleSearchSubmit} className="flex gap-2">
                        <Input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search collections by username..."
                            fullWidth
                        />
                        <Button type="submit" variant="default">
                            <Search className="h-4 w-4 mr-2" />
                            Search
                        </Button>
                    </form>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6">
                        <ErrorDisplay error={error} />
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="py-12">
                        <LoadingState text="Loading collections..." size="lg" />
                    </div>
                )}

                {/* Empty State */}
                {!loading && collections.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 dark:bg-slate-800 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">No collections found</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {searchInput
                                ? `No results found for "${searchInput}"`
                                : "There are no collections available yet."}
                        </p>
                        {searchInput && (
                            <Button
                                onClick={() => {
                                    setSearchInput('');
                                    handleSearch('');
                                }}
                                variant="outline"
                            >
                                Clear Search
                            </Button>
                        )}
                    </div>
                )}

                {/* Collections Grid */}
                {!loading && collections.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {collections.map((collection) => (
                            <CollectionCard
                                key={collection.username}
                                username={collection.username}
                                createdAt={collection.createdAt}
                                cardCount={collection.cardCount}
                                sampleCards={collection.sampleCards}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="flex justify-between items-center mt-8">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                            {Math.min(pagination.page * pagination.limit, pagination.totalCollections)} of{' '}
                            {pagination.totalCollections} collections
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
                            <span className="flex items-center px-3 py-1 text-sm dark:text-gray-400">
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
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { CollectionCard } from '@/components/CollectionCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCollections } from '@/hooks/useCollections';

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
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Explore Collections</h1>

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
                    <div className="p-4 bg-red-50 text-red-700 rounded-md mb-6">
                        <p className="font-medium">Error</p>
                        <p>{error}</p>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        <span className="ml-2 text-gray-600">Loading collections...</span>
                    </div>
                )}

                {/* Empty State */}
                {!loading && collections.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No collections found</h3>
                        <p className="text-gray-600 mb-4">
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
                        <div className="text-sm text-gray-600">
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
            </div>
        </div>
    );
}

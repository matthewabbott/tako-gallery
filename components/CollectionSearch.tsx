'use client';

import { useState, useEffect } from 'react';
import { Search, SortAsc, SortDesc, X, Filter } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { SortField, SortOrder } from '@/hooks/useCollectionSearch';

interface CollectionSearchProps {
    searchQuery: string;
    sortField: SortField;
    sortOrder: SortOrder;
    onSearchChange: (query: string) => void;
    onSortFieldChange: (field: SortField) => void;
    onSortOrderChange: (order: SortOrder) => void;
    onReset: () => void;
}

export function CollectionSearch({
    searchQuery,
    sortField,
    sortOrder,
    onSearchChange,
    onSortFieldChange,
    onSortOrderChange,
    onReset,
}: CollectionSearchProps) {
    const [inputValue, setInputValue] = useState(searchQuery);
    const [showSortOptions, setShowSortOptions] = useState(false);

    // Update input value when searchQuery prop changes
    useEffect(() => {
        setInputValue(searchQuery);
    }, [searchQuery]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearchChange(inputValue);
    };

    const handleClear = () => {
        setInputValue('');
        onSearchChange('');
    };

    const toggleSortOrder = () => {
        onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-grow">
                    <Input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Search cards by title, description, or query..."
                        fullWidth
                        className="pr-10"
                    />
                    {inputValue && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="flex gap-2">
                    <Button type="submit" variant="default">
                        <Search className="h-4 w-4 mr-2" />
                        Search
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowSortOptions(!showSortOptions)}
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        Sort
                    </Button>

                    {searchQuery && (
                        <Button type="button" variant="outline" onClick={onReset}>
                            Reset
                        </Button>
                    )}
                </div>
            </form>

            {/* Sort Options */}
            {showSortOptions && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <div className="flex flex-wrap gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant={sortField === 'createdAt' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => onSortFieldChange('createdAt')}
                                >
                                    Date
                                </Button>
                                <Button
                                    type="button"
                                    variant={sortField === 'title' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => onSortFieldChange('title')}
                                >
                                    Title
                                </Button>
                                <Button
                                    type="button"
                                    variant={sortField === 'query' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => onSortFieldChange('query')}
                                >
                                    Query
                                </Button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={toggleSortOrder}
                                className="flex items-center"
                            >
                                {sortOrder === 'asc' ? (
                                    <>
                                        <SortAsc className="h-4 w-4 mr-1" />
                                        Ascending
                                    </>
                                ) : (
                                    <>
                                        <SortDesc className="h-4 w-4 mr-1" />
                                        Descending
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { Search, SortAsc, SortDesc, X, Filter } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/input';
import { SortField, SortOrder } from '@/hooks/useCollectionSearch';

interface CollectionSearchProps {
    searchQuery: string;
    sortField: SortField;
    sortOrder: SortOrder;
    sourceFilter?: string;
    sourceIndexFilter?: string;
    methodologyFilter?: string;
    onSearchChange: (query: string) => void;
    onSortFieldChange: (field: SortField) => void;
    onSortOrderChange: (order: SortOrder) => void;
    onSourceFilterChange?: (filter: string) => void;
    onSourceIndexFilterChange?: (filter: string) => void;
    onMethodologyFilterChange?: (filter: string) => void;
    onReset: () => void;
}

export function CollectionSearch({
    searchQuery,
    sortField,
    sortOrder,
    sourceFilter = '',
    sourceIndexFilter = '',
    methodologyFilter = '',
    onSearchChange,
    onSortFieldChange,
    onSortOrderChange,
    onSourceFilterChange,
    onSourceIndexFilterChange,
    onMethodologyFilterChange,
    onReset,
}: CollectionSearchProps) {
    const [inputValue, setInputValue] = useState(searchQuery);
    const [sourceFilterValue, setSourceFilterValue] = useState(sourceFilter);
    const [sourceIndexFilterValue, setSourceIndexFilterValue] = useState(sourceIndexFilter);
    const [methodologyFilterValue, setMethodologyFilterValue] = useState(methodologyFilter);
    const [showSortOptions, setShowSortOptions] = useState(false);
    const [showTakoFilters, setShowTakoFilters] = useState(false);

    // Update input values when props change
    useEffect(() => {
        setInputValue(searchQuery);
    }, [searchQuery]);

    useEffect(() => {
        setSourceFilterValue(sourceFilter);
    }, [sourceFilter]);

    useEffect(() => {
        setSourceIndexFilterValue(sourceIndexFilter);
    }, [sourceIndexFilter]);

    useEffect(() => {
        setMethodologyFilterValue(methodologyFilter);
    }, [methodologyFilter]);

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
        <div className="bg-white dark:bg-tako-dark-surface rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-tako-dark-border p-4 mb-6">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-grow">
                    <Input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Search cards by title, description, or query..."
                        fullWidth
                        className="pr-10" // Input component handles dark mode
                    />
                    {inputValue && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-tako-dark-text-secondary"
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

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowTakoFilters(!showTakoFilters)}
                        className={showTakoFilters ? 'bg-blue-50 dark:bg-tako-dark-accent/20 border-blue-300 dark:border-tako-dark-accent/50' : ''}
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        Tako Filters
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
                <div className="mt-4 p-3 bg-gray-50 dark:bg-tako-dark-border rounded-md">
                    <div className="flex flex-wrap gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-tako-dark-text-primary mb-1">Sort By</label>
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
                                <Button
                                    type="button"
                                    variant={sortField === 'sourcesCount' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => onSortFieldChange('sourcesCount')}
                                >
                                    Sources Count
                                </Button>
                                <Button
                                    type="button"
                                    variant={sortField === 'methodologiesCount' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => onSortFieldChange('methodologiesCount')}
                                >
                                    Methodologies Count
                                </Button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-tako-dark-text-primary mb-1">Order</label>
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

            {/* Tako-specific Filters */}
            {showTakoFilters && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-tako-dark-accent/10 rounded-md border border-blue-200 dark:border-tako-dark-accent/30">
                    <h3 className="text-sm font-semibold text-blue-800 dark:text-tako-dark-accent mb-3">Tako API Filters</h3>

                    <div className="space-y-4">
                        {/* Source Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-tako-dark-text-primary mb-1">
                                Source Name
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    value={sourceFilterValue}
                                    onChange={(e) => {
                                        setSourceFilterValue(e.target.value);
                                        if (onSourceFilterChange) {
                                            onSourceFilterChange(e.target.value);
                                        }
                                    }}
                                    placeholder="Filter by source name..."
                                    fullWidth
                                />
                            </div>
                        </div>

                        {/* Source Index Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-tako-dark-text-primary mb-1">
                                Source Index
                            </label>
                            <select
                                value={sourceIndexFilterValue}
                                onChange={(e) => {
                                    setSourceIndexFilterValue(e.target.value);
                                    if (onSourceIndexFilterChange) {
                                        onSourceIndexFilterChange(e.target.value);
                                    }
                                }}
                                className="w-full p-2 border rounded dark:bg-tako-dark-surface dark:border-tako-dark-border dark:text-tako-dark-text-primary focus:ring-2 focus:ring-blue-600 dark:focus:ring-tako-dark-accent focus:border-transparent"
                            >
                                <option value="">All Indexes</option>
                                <option value="tako">Tako</option>
                                {/* Add other indexes as needed */}
                            </select>
                        </div>

                        {/* Methodology Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-tako-dark-text-primary mb-1">
                                Methodology
                            </label>
                            <Input
                                type="text"
                                value={methodologyFilterValue}
                                onChange={(e) => {
                                    setMethodologyFilterValue(e.target.value);
                                    if (onMethodologyFilterChange) {
                                        onMethodologyFilterChange(e.target.value);
                                    }
                                }}
                                placeholder="Filter by methodology..."
                                fullWidth
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

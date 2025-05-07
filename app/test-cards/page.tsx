// app/test-cards/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function TestCardsPage() {
    const [username, setUsername] = useState('');
    const [cards, setCards] = useState<any[]>([]);
    const [pagination, setPagination] = useState<any>(null);
    const [collection, setCollection] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');

    // Delete card state
    const [deleteCardId, setDeleteCardId] = useState<string | null>(null);
    const [deleteApiKey, setDeleteApiKey] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

    // Fetch cards when username, page, or search changes
    useEffect(() => {
        if (!username) return;

        const fetchCards = async () => {
            setLoading(true);
            setError(null);

            try {
                const queryParams = new URLSearchParams({
                    username,
                    page: page.toString(),
                });

                if (search) {
                    queryParams.append('search', search);
                }

                const response = await fetch(`/api/cards?${queryParams.toString()}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch cards');
                }

                setCards(data.data.cards);
                setPagination(data.data.pagination);
                setCollection(data.data.collection);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchCards();
    }, [username, page, search]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1);
    };

    const handleDeleteCard = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!deleteCardId || !deleteApiKey) return;

        setDeleteLoading(true);
        setDeleteError(null);
        setDeleteSuccess(null);

        try {
            const response = await fetch(`/api/cards/${deleteCardId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ apiKey: deleteApiKey }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete card');
            }

            setDeleteSuccess(`Card ${data.data.cardId} deleted successfully`);

            // Remove the deleted card from the list
            setCards(cards.filter(card => card.cardId !== deleteCardId));

            // Reset delete form
            setDeleteCardId(null);
            setDeleteApiKey('');
        } catch (error) {
            setDeleteError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Test Cards API</h1>

            <div className="mb-8">
                <h2 className="text-xl font-bold mb-2">Fetch Cards</h2>
                <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                        <label htmlFor="username" className="block mb-2 font-medium">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Enter username"
                        />
                    </div>

                    <div className="flex-1">
                        <form onSubmit={handleSearch}>
                            <label htmlFor="search" className="block mb-2 font-medium">
                                Search
                            </label>
                            <div className="flex">
                                <input
                                    type="text"
                                    id="search"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="flex-1 p-2 border rounded-l"
                                    placeholder="Search cards"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-r"
                                >
                                    Search
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-8">Loading cards...</div>
            ) : (
                <>
                    {collection && (
                        <div className="mb-4">
                            <h2 className="text-xl font-bold">Collection: {collection.username}</h2>
                            <p>Created: {new Date(collection.createdAt).toLocaleDateString()}</p>
                        </div>
                    )}

                    {cards.length > 0 ? (
                        <div className="mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {cards.map((card) => (
                                    <div key={card.id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                                        <div className="relative aspect-video">
                                            <img
                                                src={card.imageUrl || "/placeholder.svg"}
                                                alt={card.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-lg mb-2">{card.title}</h3>
                                            <p className="text-sm text-gray-600 mb-2">
                                                Query: {card.query}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Created: {new Date(card.createdAt).toLocaleDateString()}
                                            </p>
                                            <div className="mt-4 flex justify-between">
                                                <a
                                                    href={card.webpageUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline text-sm"
                                                >
                                                    View Card
                                                </a>
                                                <button
                                                    onClick={() => setDeleteCardId(card.cardId)}
                                                    className="text-red-600 hover:underline text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {pagination && (
                                <div className="flex justify-between items-center mt-6">
                                    <div>
                                        Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                                        {Math.min(pagination.page * pagination.limit, pagination.totalCards)} of{' '}
                                        {pagination.totalCards} cards
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setPage(page - 1)}
                                            disabled={!pagination.hasPrevPage}
                                            className="px-3 py-1 border rounded disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        <span className="px-3 py-1">
                                            Page {pagination.page} of {pagination.totalPages}
                                        </span>
                                        <button
                                            onClick={() => setPage(page + 1)}
                                            disabled={!pagination.hasNextPage}
                                            className="px-3 py-1 border rounded disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            {username ? 'No cards found' : 'Enter a username to view cards'}
                        </div>
                    )}
                </>
            )}

            {deleteCardId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Delete Card</h2>
                        <p className="mb-4">
                            To delete this card, please enter the Tako API key used to create it.
                        </p>

                        <form onSubmit={handleDeleteCard}>
                            <div className="mb-4">
                                <label htmlFor="deleteApiKey" className="block mb-2 font-medium">
                                    Tako API Key
                                </label>
                                <input
                                    type="text"
                                    id="deleteApiKey"
                                    value={deleteApiKey}
                                    onChange={(e) => setDeleteApiKey(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            {deleteError && (
                                <div className="p-3 bg-red-100 text-red-700 rounded mb-4 text-sm">
                                    {deleteError}
                                </div>
                            )}

                            {deleteSuccess && (
                                <div className="p-3 bg-green-100 text-green-700 rounded mb-4 text-sm">
                                    {deleteSuccess}
                                </div>
                            )}

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setDeleteCardId(null)}
                                    className="px-4 py-2 border rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={deleteLoading || !deleteApiKey}
                                    className="px-4 py-2 bg-red-600 text-white rounded disabled:bg-red-400"
                                >
                                    {deleteLoading ? 'Deleting...' : 'Delete Card'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
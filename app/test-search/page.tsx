// app/test-search/page.tsx
'use client';

import { useState } from 'react';

export default function TestSearchPage() {
    const [apiKey, setApiKey] = useState('');
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ apiKey, query }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'An error occurred');
            }

            setResult(data.data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Test Search API</h1>

            <form onSubmit={handleSubmit} className="mb-8">
                <div className="mb-4">
                    <label htmlFor="apiKey" className="block mb-2 font-medium">
                        Tako API Key
                    </label>
                    <input
                        type="text"
                        id="apiKey"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="query" className="block mb-2 font-medium">
                        Search Query
                    </label>
                    <input
                        type="text"
                        id="query"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-blue-400"
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {error && (
                <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
                    {error}
                </div>
            )}

            {result && (
                <div className="p-4 bg-white rounded shadow">
                    <h2 className="text-xl font-bold mb-2">Search Result</h2>

                    <div className="mb-4">
                        <h3 className="font-bold">Card</h3>
                        <p><strong>Title:</strong> {result.card.title}</p>
                        <p><strong>Card ID:</strong> {result.card.cardId}</p>
                        <p><strong>Query:</strong> {result.card.query}</p>
                    </div>

                    <div>
                        <h3 className="font-bold">Collection</h3>
                        <p><strong>Username:</strong> {result.collection.username}</p>
                        <p><strong>New User:</strong> {result.collection.isNewUser ? 'Yes' : 'No'}</p>
                    </div>

                    {result.collection.isNewUser && (
                        <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 rounded">
                            <p>This is a new user! You should be prompted to choose a username.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
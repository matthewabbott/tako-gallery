// app/test-username/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function TestUsernamePage() {
    const [apiKey, setApiKey] = useState('');
    const [username, setUsername] = useState('');
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [availabilityError, setAvailabilityError] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [checkingAvailability, setCheckingAvailability] = useState(false);

    // Check username availability when username changes
    useEffect(() => {
        const checkAvailability = async () => {
            if (!username || username.length < 3) {
                setIsAvailable(null);
                setAvailabilityError(null);
                return;
            }

            setCheckingAvailability(true);
            setAvailabilityError(null);

            try {
                const response = await fetch(`/api/username?username=${encodeURIComponent(username)}`);
                const data = await response.json();

                if (response.ok && data.success) {
                    setIsAvailable(data.data.available);
                    setAvailabilityError(data.data.error || null);
                } else {
                    setIsAvailable(false);
                    setAvailabilityError(data.error || 'Failed to check availability');
                }
            } catch (error) {
                setIsAvailable(false);
                setAvailabilityError('Error checking availability');
            } finally {
                setCheckingAvailability(false);
            }
        };

        const timeoutId = setTimeout(checkAvailability, 500);
        return () => clearTimeout(timeoutId);
    }, [username]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/username', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ apiKey, username }),
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
            <h1 className="text-2xl font-bold mb-4">Test Username API</h1>

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
                    <label htmlFor="username" className="block mb-2 font-medium">
                        Username
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={`w-full p-2 border rounded ${isAvailable === true ? 'border-green-500' :
                                isAvailable === false ? 'border-red-500' : ''
                                }`}
                            required
                        />
                        {checkingAvailability && (
                            <span className="absolute right-3 top-2 text-gray-400">
                                Checking...
                            </span>
                        )}
                        {!checkingAvailability && isAvailable === true && (
                            <span className="absolute right-3 top-2 text-green-500">
                                Available
                            </span>
                        )}
                        {!checkingAvailability && isAvailable === false && !availabilityError && (
                            <span className="absolute right-3 top-2 text-red-500">
                                Not available
                            </span>
                        )}
                    </div>
                    {availabilityError && (
                        <p className="mt-1 text-sm text-red-500">{availabilityError}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading || isAvailable !== true}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-blue-400"
                >
                    {loading ? 'Updating...' : 'Update Username'}
                </button>
            </form>

            {error && (
                <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
                    {error}
                </div>
            )}

            {result && (
                <div className="p-4 bg-white rounded shadow">
                    <h2 className="text-xl font-bold mb-2">Username Updated</h2>
                    <p><strong>Username:</strong> {result.username}</p>
                    <p><strong>Collection URL:</strong> <a href={result.collectionUrl} className="text-blue-600 underline">{result.collectionUrl}</a></p>
                </div>
            )}
        </div>
    );
}
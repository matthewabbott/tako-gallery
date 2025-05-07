// app/test-card-grid/page.tsx
'use client';

import { useState } from 'react';
import { CardGrid } from '@/components/CardGrid';

export default function TestCardGridPage() {
    const [username, setUsername] = useState('');
    const [showGrid, setShowGrid] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username) {
            setShowGrid(true);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {!showGrid ? (
                <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h1 className="text-2xl font-bold mb-6 text-center">View Collection</h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder="Enter a username"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                            >
                                View Collection
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div>
                    <button
                        onClick={() => setShowGrid(false)}
                        className="mb-6 text-blue-600 hover:underline flex items-center"
                    >
                        ← Back to Search
                    </button>

                    <CardGrid username={username} />
                </div>
            )}
        </div>
    );
}
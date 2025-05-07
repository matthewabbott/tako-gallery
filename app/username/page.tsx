'use client';

import { useState } from 'react';
import { UsernameForm } from '@/components/UsernameForm';

export default function UsernamePage() {
    const [apiKey, setApiKey] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [success, setSuccess] = useState<{ username: string; url: string } | null>(null);

    const handleApiKeySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (apiKey) {
            setShowForm(true);
        }
    };

    const handleSuccess = (username: string, collectionUrl: string) => {
        setSuccess({ username, url: collectionUrl });
        setShowForm(false);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-md mx-auto">
                {!showForm && !success && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h1 className="text-2xl font-bold mb-6 text-center">Update Username</h1>

                        <p className="mb-6 text-gray-600">
                            Enter your Tako API key to update your collection username.
                        </p>

                        <form onSubmit={handleApiKeySubmit} className="space-y-6">
                            <div>
                                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tako API Key
                                </label>
                                <input
                                    id="apiKey"
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder="Enter your Tako API key"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                            >
                                Continue
                            </button>
                        </form>
                    </div>
                )}

                {showForm && (
                    <UsernameForm initialApiKey={apiKey} onSuccess={handleSuccess} />
                )}

                {success && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h1 className="text-2xl font-bold mb-6 text-center">Username Updated</h1>

                        <div className="p-4 bg-green-50 text-green-700 rounded-md mb-6">
                            <p className="font-medium">Success!</p>
                            <p>Your username has been updated to <strong>{success.username}</strong>.</p>
                        </div>

                        <p className="mb-4">
                            Your collection is now available at:
                        </p>

                        <div className="p-3 bg-gray-100 rounded mb-6 break-all">
                            <a
                                href={success.url}
                                className="text-blue-600 hover:underline"
                            >
                                {success.url}
                            </a>
                        </div>

                        <div className="flex justify-center">
                            <a
                                href={`/${success.username}`}
                                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                            >
                                View Your Collection
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
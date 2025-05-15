'use client';

import { useState } from 'react';
import { UsernameForm } from '@/components/UsernameForm';
import { Input } from '@/components/ui/input'; // Import custom Input
import { Button, buttonVariants } from '@/components/ui/Button'; // Import custom Button and buttonVariants
import Link from 'next/link'; // Import Link for the success button
import { cn } from '@/lib/utils'; // Import cn

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
                    <div className="bg-slate-50 dark:bg-tako-dark-surface rounded-lg shadow-md dark:shadow-lg p-6">
                        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-tako-dark-text-primary">Update Username</h1>

                        <p className="mb-6 text-gray-600 dark:text-tako-dark-text-secondary">
                            Enter your Tako API key to update your collection username.
                        </p>

                        <form onSubmit={handleApiKeySubmit} className="space-y-6">
                            <div>
                                <label htmlFor="apiKeyInitial" className="block text-sm font-medium text-gray-700 dark:text-tako-dark-text-primary mb-1">
                                    Tako API Key
                                </label>
                                <Input
                                    id="apiKeyInitial"
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="Enter your Tako API key"
                                    required
                                    fullWidth
                                />
                            </div>

                            <Button
                                type="submit"
                                fullWidth
                            >
                                Continue
                            </Button>
                        </form>
                    </div>
                )}

                {showForm && (
                    <UsernameForm initialApiKey={apiKey} onSuccess={handleSuccess} />
                )}

                {success && (
                    <div className="bg-slate-50 dark:bg-tako-dark-surface rounded-lg shadow-md dark:shadow-lg p-6">
                        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-tako-dark-text-primary">Username Updated</h1>

                        <div className="p-4 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md mb-6">
                            <p className="font-medium">Success!</p>
                            <p>Your username has been updated to <strong className="dark:text-green-200">{success.username}</strong>.</p>
                        </div>

                        <p className="mb-4 text-gray-700 dark:text-tako-dark-text-secondary">
                            Your collection is now available at:
                        </p>

                        <div className="p-3 bg-gray-100 dark:bg-tako-dark-border rounded mb-6 break-all">
                            <a
                                href={success.url}
                                className="text-blue-600 hover:underline dark:text-tako-dark-accent dark:hover:underline"
                            >
                                {success.url}
                            </a>
                        </div>

                        <div className="flex justify-center">
                            <Link
                                href={`/collections/${success.username}`}
                                className={cn(buttonVariants({ variant: 'default', size: 'default', fullWidth: true }))}
                            >
                                View Your Collection
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

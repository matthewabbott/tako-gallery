'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function NewCollectionPage() {
    const router = useRouter();
    const [apiKey, setApiKey] = useState<string>('');
    const [username, setUsername] = useState('');
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [availabilityError, setAvailabilityError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

    // Get API key from session storage
    useEffect(() => {
        const storedApiKey = sessionStorage.getItem('takoApiKey');
        if (storedApiKey) {
            setApiKey(storedApiKey);
        } else {
            // If no API key is found, redirect to home page
            router.push('/');
        }
    }, [router]);

    // Check username availability when username changes
    useEffect(() => {
        const checkAvailability = async () => {
            if (!username || username.length < 3) {
                setIsAvailable(null);
                setAvailabilityError(null);
                return;
            }

            setIsCheckingAvailability(true);
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
                setIsCheckingAvailability(false);
            }
        };

        const timeoutId = setTimeout(checkAvailability, 500);
        return () => clearTimeout(timeoutId);
    }, [username]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!apiKey || !username) {
            setError('API key and username are required');
            return;
        }

        if (!isAvailable) {
            setError('Please choose an available username');
            return;
        }

        setIsLoading(true);
        setError(null);

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
                throw new Error(data.error || 'An error occurred while updating username');
            }

            // Clear API key from session storage
            sessionStorage.removeItem('takoApiKey');

            // Redirect to collection page
            router.push(`/${data.data.username}`);
        } catch (error) {
            console.error('Username update error:', error);
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold mb-6 text-center">Create Your Collection</h1>

                    <p className="mb-6 text-gray-600">
                        Choose a username for your collection. This will be used as the URL for your collection page.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <div className="relative">
                                <Input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Choose a username"
                                    fullWidth
                                    required
                                    className={
                                        isAvailable === true ? 'border-green-500 pr-10' :
                                            isAvailable === false ? 'border-red-500 pr-10' : ''
                                    }
                                />
                                {isCheckingAvailability && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                    </div>
                                )}
                                {!isCheckingAvailability && isAvailable === true && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    </div>
                                )}
                                {!isCheckingAvailability && isAvailable === false && !availabilityError && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <AlertCircle className="h-4 w-4 text-red-500" />
                                    </div>
                                )}
                            </div>
                            {availabilityError && (
                                <p className="mt-1 text-sm text-red-600">{availabilityError}</p>
                            )}
                            {isAvailable === true && (
                                <p className="mt-1 text-sm text-green-600">Username is available!</p>
                            )}
                            {isAvailable === false && !availabilityError && (
                                <p className="mt-1 text-sm text-red-600">Username is already taken</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                Username must be 3-30 characters long and can only contain letters, numbers, underscores, and hyphens.
                            </p>
                        </div>

                        <Button
                            type="submit"
                            isLoading={isLoading}
                            disabled={!isAvailable || isLoading}
                            fullWidth
                        >
                            Create Collection
                        </Button>
                    </form>

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-md flex items-start">
                            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium">Error</p>
                                <p className="text-sm">{error}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { ErrorDisplay } from '@/components/ErrorBoundary';
import { LoadingState } from '@/components/LoadingState';
import { clearPagesGlobalCache } from '@/hooks/usePreloadCache';

interface UsernameChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUsername: string;
}

export function UsernameChangeModal({ isOpen, onClose, currentUsername }: UsernameChangeModalProps) {
    const router = useRouter();
    const [apiKey, setApiKey] = useState('');
    const [username, setUsername] = useState('');
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [availabilityError, setAvailabilityError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<{ username: string; url: string } | null>(null);

    // Check username availability
    const checkAvailability = async (username: string) => {
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

    // Handle username change
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUsername = e.target.value;
        setUsername(newUsername);

        // Debounce the availability check
        const timeoutId = setTimeout(() => {
            checkAvailability(newUsername);
        }, 500);

        return () => clearTimeout(timeoutId);
    };

    // Handle form submission
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

            // Set success state
            setSuccess({
                username: data.data.username,
                url: data.data.collectionUrl,
            });

            // Clear the pages cache to force a fresh fetch when redirecting
            clearPagesGlobalCache();

            // Update the URL without a full page reload
            router.push(`/collections/${data.data.username}`);

            // Close the modal after a short delay
            setTimeout(() => {
                onClose();
                // Reset form state
                setApiKey('');
                setUsername('');
                setIsAvailable(null);
                setAvailabilityError(null);
                setError(null);
                setSuccess(null);
            }, 2000);

        } catch (error) {
            console.error('Username update error:', error);
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Change Username</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {success ? (
                    <div className="p-6">
                        <div className="p-4 bg-green-50 text-green-700 rounded-md flex items-start mb-4">
                            <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium">Success!</p>
                                <p>Your username has been updated to <strong>{success.username}</strong>.</p>
                            </div>
                        </div>
                        <p className="mb-2">Your collection is now available at:</p>
                        <div className="p-3 bg-gray-100 rounded mb-4 break-all">
                            <a
                                href={success.url}
                                className="text-blue-600 hover:underline"
                            >
                                {success.url}
                            </a>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                                Tako API Key
                            </label>
                            <Input
                                id="apiKey"
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Enter your Tako API key"
                                fullWidth
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Enter the API key associated with this collection.
                            </p>
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                New Username
                            </label>
                            <div className="relative">
                                <Input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={handleUsernameChange}
                                    placeholder="Choose a new username"
                                    fullWidth
                                    required
                                    className={
                                        isAvailable === true ? 'border-green-500 pr-10' :
                                            isAvailable === false ? 'border-red-500 pr-10' : ''
                                    }
                                />
                                {isCheckingAvailability && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
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

                        {error && (
                            <div className="mt-2">
                                <ErrorDisplay error={error} />
                            </div>
                        )}

                        <div className="flex justify-end space-x-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                isLoading={isLoading}
                                disabled={!isAvailable || isLoading}
                            >
                                Update Username
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, AlertTriangle, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useDeleteCollection } from '@/hooks/useDeleteCollection';
import { ErrorDisplay } from '@/components/ErrorBoundary';
import { cn } from '@/lib/utils';

interface DeleteCollectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    username: string;
}

export function DeleteCollectionModal({ isOpen, onClose, username }: DeleteCollectionModalProps) {
    const [apiKey, setApiKey] = useState('');
    const [isValidated, setIsValidated] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [showSplitButtons, setShowSplitButtons] = useState(false);
    const deleteButtonRef = useRef<HTMLButtonElement>(null);
    const confirmButtonRef = useRef<HTMLButtonElement>(null);
    const cancelButtonRef = useRef<HTMLButtonElement>(null);

    const {
        isDeleting,
        error,
        success,
        isValidApiKey,
        deleteCollection,
        validateApiKey
    } = useDeleteCollection();

    const router = useRouter();

    // Reset state when modal is opened/closed
    useEffect(() => {
        if (isOpen) {
            setApiKey('');
            setIsValidated(false);
            setShowSplitButtons(false);
        }
    }, [isOpen]);

    // Handle API key validation
    const handleValidateApiKey = async () => {
        if (!apiKey) return;

        setIsValidating(true);
        const isValid = await validateApiKey(username, apiKey);
        setIsValidated(isValid);
        setIsValidating(false);

        if (isValid) {
            // Trigger the button split animation after validation
            setTimeout(() => {
                setShowSplitButtons(true);
            }, 300);
        }
    };

    // Handle collection deletion
    const handleDelete = async () => {
        await deleteCollection(username, apiKey);
    };

    // If deletion was successful, redirect to the home page
    useEffect(() => {
        if (success) {
            router.push('/');
        }
    }, [success, router]);

    // If the modal is not open, don't render anything
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-red-600">Delete Collection</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        disabled={isDeleting}
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex items-start mb-6">
                        <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-red-600">Delete this collection?</h3>
                            <p className="text-sm text-gray-700 mt-1">
                                This action cannot be undone. The collection and all its cards will be permanently deleted.
                            </p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                            Enter your API key to confirm deletion
                        </label>
                        <Input
                            id="apiKey"
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Your Tako API key"
                            fullWidth
                            disabled={isValidated || isValidating || isDeleting}
                        />
                    </div>

                    {error && (
                        <div className="mb-6">
                            <ErrorDisplay error={error} />
                        </div>
                    )}

                    <div className="flex justify-end">
                        {!isValidated ? (
                            <Button
                                onClick={handleValidateApiKey}
                                variant="destructive"
                                disabled={!apiKey || isValidating}
                                isLoading={isValidating}
                            >
                                {isValidating ? 'Validating...' : 'Validate API Key'}
                            </Button>
                        ) : (
                            <div className={cn(
                                "relative transition-all duration-300 ease-in-out",
                                showSplitButtons ? "w-full" : "w-auto"
                            )}>
                                {/* Delete button that will be replaced by split buttons */}
                                <Button
                                    ref={deleteButtonRef}
                                    variant="destructive"
                                    className={cn(
                                        "w-full transition-all duration-300",
                                        showSplitButtons
                                            ? "opacity-0 absolute invisible hidden"
                                            : "opacity-100 relative"
                                    )}
                                    disabled={true}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Collection
                                </Button>

                                {/* Split buttons container */}
                                <div className={cn(
                                    "flex gap-3 transition-all duration-300 relative",
                                    showSplitButtons
                                        ? "opacity-100 z-10"
                                        : "opacity-0 absolute pointer-events-none"
                                )}>
                                    <Button
                                        ref={confirmButtonRef}
                                        onClick={handleDelete}
                                        variant="destructive"
                                        disabled={isDeleting}
                                        isLoading={isDeleting}
                                        fullWidth
                                    >
                                        {isDeleting ? 'Deleting...' : (
                                            <>
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Confirm Delete
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        ref={cancelButtonRef}
                                        onClick={onClose}
                                        variant="outline"
                                        disabled={isDeleting}
                                        fullWidth
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

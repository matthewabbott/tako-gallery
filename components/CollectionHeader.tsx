'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Share2, Calendar, Grid, UserRound } from 'lucide-react';
import { Button } from './ui/Button';
import { formatDate } from '@/lib/utils';
import { UsernameChangeModal } from './UsernameChangeModal';

interface CollectionHeaderProps {
    username: string;
    createdAt: string;
    cardCount: number;
}

export function CollectionHeader({ username, createdAt, cardCount }: CollectionHeaderProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [highlightUsernameButton, setHighlightUsernameButton] = useState(false);
    const searchParams = useSearchParams();

    // Check if we should highlight the username change button
    useEffect(() => {
        if (searchParams.get('highlight') === 'username') {
            setHighlightUsernameButton(true);
            // No timeout - will be reset when button is clicked
        }
    }, [searchParams]);

    const shareCollection = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        // Could add a toast notification here
        alert('Collection URL copied to clipboard!');
    };

    const openUsernameModal = () => {
        setIsModalOpen(true);
        // Reset highlight when button is clicked
        setHighlightUsernameButton(false);
    };

    const closeUsernameModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{username}&apos;s Collection</h1>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-gray-600">
                        <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Created {formatDate(createdAt)}</span>
                        </div>
                        <div className="flex items-center">
                            <Grid className="h-4 w-4 mr-2" />
                            <span>{cardCount} {cardCount === 1 ? 'card' : 'cards'}</span>
                        </div>
                    </div>
                </div>
                <div className="mt-4 md:mt-0 flex gap-2">
                    <Button
                        onClick={openUsernameModal}
                        variant={highlightUsernameButton ? "default" : "ghost"}
                        className={`flex items-center justify-center ${highlightUsernameButton ? 'animate-pulse w-auto' : 'w-10 h-10 p-0'}`}
                        title="Change username"
                    >
                        <UserRound className="h-4 w-4" />
                        {highlightUsernameButton && <span className="ml-2">Change Username</span>}
                    </Button>
                    <Button onClick={shareCollection} variant="outline" className="flex items-center">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Collection
                    </Button>
                </div>
            </div>

            {/* Username change modal */}
            <UsernameChangeModal
                isOpen={isModalOpen}
                onClose={closeUsernameModal}
                highlightMode={highlightUsernameButton}
            />
        </div>
    );
}

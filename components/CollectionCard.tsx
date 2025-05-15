'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Grid } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface SampleCard {
    id: string;
    cardId: string;
    title: string;
    imageUrl: string;
    createdAt: string;
}

interface CollectionCardProps {
    username: string;
    createdAt: string;
    cardCount: number;
    sampleCards: SampleCard[];
}

export function CollectionCard({ username, createdAt, cardCount, sampleCards }: CollectionCardProps) {
    return (
        <Link
            href={`/collections/${username}`}
            className="block bg-slate-50 dark:bg-tako-dark-surface rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-tako-dark-border overflow-hidden transition-all duration-300 hover:shadow-md dark:hover:shadow-lg hover:border-blue-300 dark:hover:border-tako-dark-accent hover:translate-y-[-4px]"
        >
            <div className="p-4 border-b border-gray-200 dark:border-tako-dark-border">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-tako-dark-text-primary mb-2">{username}'s Collection</h3>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-tako-dark-text-secondary">
                    <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Created {formatDate(createdAt)}</span>
                    </div>
                    <div className="flex items-center">
                        <Grid className="h-4 w-4 mr-1" />
                        <span>{cardCount} {cardCount === 1 ? 'card' : 'cards'}</span>
                    </div>
                </div>
            </div>

            {sampleCards.length > 0 ? (
                <div className="grid grid-cols-2 gap-1 p-1">
                    {sampleCards.slice(0, 4).map((card) => (
                        <div key={card.id} className="aspect-video relative rounded overflow-hidden group">
                            <Image
                                src={card.imageUrl || "/placeholder.svg"}
                                alt={card.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-4 text-center text-gray-500 dark:text-tako-dark-text-secondary italic">
                    No cards in this collection yet
                </div>
            )}
        </Link>
    );
}

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
            className="block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-blue-300 hover:translate-y-[-4px]"
        >
            <div className="p-4 border-b">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{username}&apos;s Collection</h3>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
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
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-4 text-center text-gray-500 italic">
                    No cards in this collection yet
                </div>
            )}
        </Link>
    );
}

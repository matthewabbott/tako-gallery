'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Info, Calendar, Search } from 'lucide-react';
import { useCard } from '@/hooks/useCard';
import { GroundingInfo } from '@/components/GroundingInfo';
import { DeleteCard } from '@/components/DeleteCard';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

export default function CardDetailPage() {
    const params = useParams();
    const username = params.username as string;
    const cardId = params.cardId as string;

    const [showGrounding, setShowGrounding] = useState(false);
    const { card, loading, error } = useCard(cardId);

    // Handle iframe resizing
    useEffect(() => {
        const handleResize = (e: MessageEvent) => {
            if (e.data.type === 'tako::resize') {
                const iframe = document.getElementById('tako-iframe') as HTMLIFrameElement;
                if (iframe) {
                    iframe.style.height = `${e.data.height}px`;
                }
            }
        };

        window.addEventListener('message', handleResize);

        return () => {
            window.removeEventListener('message', handleResize);
        };
    }, []);

    // If card not found, trigger not-found page
    if (!loading && !card && !error) {
        notFound();
    }

    // If there's an error, display it
    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href={`/collections/${username}`}
                        className="inline-flex items-center text-blue-600 hover:underline dark:text-tako-dark-accent dark:hover:text-tako-dark-accent-hover mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Collection
                    </Link>

                    <div className="p-4 bg-red-50 dark:bg-tako-dark-surface border border-red-200 dark:border-red-500 rounded-md text-red-700 dark:text-red-400">
                        <p className="font-medium">Error</p>
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <Link
                    href={`/collections/${username}`}
                    className="inline-flex items-center text-blue-600 hover:underline dark:text-tako-dark-accent dark:hover:text-tako-dark-accent-hover mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Collection
                </Link>

                {loading ? (
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 dark:bg-tako-dark-border rounded w-3/4 mb-4"></div>
                        <div className="flex gap-4 mb-6">
                            <div className="h-4 bg-gray-200 dark:bg-tako-dark-border rounded w-40"></div>
                            <div className="h-4 bg-gray-200 dark:bg-tako-dark-border rounded w-32"></div>
                        </div>
                        <div className="aspect-video bg-gray-200 dark:bg-tako-dark-border rounded mb-6"></div>
                        <div className="h-10 bg-gray-200 dark:bg-tako-dark-border rounded w-40 mb-6"></div>
                    </div>
                ) : card ? (
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-tako-dark-text-primary mb-4">{card.title}</h1>

                        {/* Card Metadata */}
                        <div className="mb-6 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-tako-dark-text-secondary">
                            <div className="flex items-center">
                                <Search className="h-4 w-4 mr-1" />
                                <span>{card.query}</span>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>{formatDate(card.createdAt)}</span>
                            </div>
                        </div>

                        {/* Card Iframe */}
                        <div className="mb-6 rounded-md overflow-hidden border dark:border-tako-dark-border">
                            <iframe
                                id="tako-iframe"
                                src={card.embedUrl}
                                className="w-full"
                                style={{ height: '500px' }}
                                frameBorder="0"
                                allowFullScreen
                            ></iframe>
                        </div>

                        {/* Action Buttons */}
                        <div className="mb-6 flex flex-wrap justify-between">
                            <div>
                                <Button
                                    onClick={() => setShowGrounding(!showGrounding)}
                                    variant="outline"
                                >
                                    <Info className="h-4 w-4 mr-2" />
                                    {showGrounding ? 'Hide Details' : 'Show Details'}
                                </Button>
                            </div>

                            <div className="flex gap-2">
                                <a
                                    href={card.webpageUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-transparent dark:text-tako-dark-text-primary border border-gray-300 dark:border-tako-dark-border hover:bg-gray-100 dark:hover:bg-tako-dark-border focus-visible:ring-gray-400 dark:focus-visible:ring-tako-dark-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 h-10 py-2 px-4"
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View on Tako
                                </a>

                                <DeleteCard cardId={cardId} username={username} />
                            </div>
                        </div>

                        {/* Grounding Information */}
                        {showGrounding && <GroundingInfo card={card} />}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

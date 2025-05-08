'use client';

import { useState, useEffect } from 'react';
import { X, ExternalLink, Info, Calendar, Search } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from '@/hooks/useCards';

interface CardDetailProps {
    card: Card;
    isOpen: boolean;
    onClose: () => void;
    username: string;
}

export function CardDetail({ card, isOpen, onClose, username }: CardDetailProps) {
    const [showGrounding, setShowGrounding] = useState(false);

    // Handle escape key to close modal
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            // Prevent scrolling when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-900 truncate">{card.title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {/* Card Metadata */}
                    <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                            <Search className="h-4 w-4 mr-1" />
                            <span>{card.query}</span>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{new Date(card.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Card Iframe */}
                    <div className="mb-6 rounded-md overflow-hidden border">
                        <iframe
                            id="tako-iframe"
                            src={card.embedUrl}
                            className="w-full"
                            style={{ height: '400px' }}
                            frameBorder="0"
                            allowFullScreen
                        ></iframe>
                    </div>

                    {/* Grounding Toggle */}
                    <Button
                        onClick={() => setShowGrounding(!showGrounding)}
                        variant="outline"
                        className="mb-4"
                    >
                        <Info className="h-4 w-4 mr-2" />
                        {showGrounding ? 'Hide Details' : 'Show Details'}
                    </Button>

                    {/* Grounding Information */}
                    {showGrounding && (
                        <div className="space-y-4">
                            {/* Description */}
                            <div className="p-4 bg-gray-50 rounded-md">
                                <h3 className="font-semibold mb-2">Description</h3>
                                <p className="text-sm text-gray-700">{card.description}</p>
                            </div>

                            {/* Sources */}
                            {card.sources && card.sources.length > 0 && (
                                <div className="p-4 bg-gray-50 rounded-md">
                                    <h3 className="font-semibold mb-2">Sources</h3>
                                    <div className="space-y-3">
                                        {card.sources.map((source, index) => (
                                            <div key={index} className="text-sm">
                                                <div className="font-medium">{source.source_name}</div>
                                                <p className="text-gray-700">{source.source_description}</p>
                                                {source.url && (
                                                    <a
                                                        href={source.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline flex items-center mt-1"
                                                    >
                                                        <span>View Source</span>
                                                        <ExternalLink className="h-3 w-3 ml-1" />
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Methodologies */}
                            {card.methodologies && card.methodologies.length > 0 && (
                                <div className="p-4 bg-gray-50 rounded-md">
                                    <h3 className="font-semibold mb-2">Methodologies</h3>
                                    <div className="space-y-3">
                                        {card.methodologies.map((methodology, index) => (
                                            <div key={index} className="text-sm">
                                                <div className="font-medium">{methodology.methodology_name}</div>
                                                <p className="text-gray-700">{methodology.methodology_description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t flex justify-between">
                    <div className="flex gap-2">
                        <a
                            href={card.webpageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-transparent border border-gray-300 hover:bg-gray-100 focus-visible:ring-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 h-10 py-2 px-4"
                        >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View on Tako
                        </a>

                        <a
                            href={`/collections/${username}/${card.cardId}`}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-transparent border border-gray-300 hover:bg-gray-100 focus-visible:ring-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 h-10 py-2 px-4"
                        >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Permalink
                        </a>
                    </div>

                    <Button onClick={onClose} variant="default">
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
}

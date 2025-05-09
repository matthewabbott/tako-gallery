'use client';

import { useState, useEffect, useRef } from 'react';
import { X, ExternalLink, Info, Calendar, Search, ChevronUp, ChevronDown } from 'lucide-react';
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
    const [isMobile, setIsMobile] = useState(false);
    const [iframeHeight, setIframeHeight] = useState(400);
    const modalRef = useRef<HTMLDivElement>(null);

    // Check if mobile on mount and on resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Handle escape key to close modal
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            // Prevent scrolling when modal is open
            document.body.style.overflow = 'hidden';

            // Add safe area inset padding for mobile devices
            if (isMobile && modalRef.current) {
                modalRef.current.style.paddingBottom = 'env(safe-area-inset-bottom, 0)';
                modalRef.current.style.paddingTop = 'env(safe-area-inset-top, 0)';
            }
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose, isMobile]);

    // Handle iframe resizing
    useEffect(() => {
        const handleResize = (e: MessageEvent) => {
            if (e.data.type === 'tako::resize') {
                const iframe = document.getElementById('tako-iframe') as HTMLIFrameElement;
                if (iframe) {
                    // Adjust height based on screen size
                    const newHeight = isMobile
                        ? Math.min(e.data.height, window.innerHeight * 0.5)
                        : e.data.height;

                    iframe.style.height = `${newHeight}px`;
                    setIframeHeight(newHeight);
                }
            }
        };

        window.addEventListener('message', handleResize);

        return () => {
            window.removeEventListener('message', handleResize);
        };
    }, [isMobile]);

    // Handle clicks outside the modal to close it
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-responsive">
            <div
                ref={modalRef}
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center p-3 sm:p-4 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate pr-2">{card.title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors touch-target"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 scrollbar-hide">
                    {/* Card Metadata - Responsive */}
                    <div className="mb-3 sm:mb-4 flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center">
                            <Search className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="truncate max-w-[200px] sm:max-w-none">{card.query}</span>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span>{new Date(card.createdAt).toLocaleDateString()}</span>
                        </div>
                        {card.sources && (
                            <div className="flex items-center">
                                <span className="font-medium">{card.sources.length}</span>
                                <span className="ml-1">sources</span>
                            </div>
                        )}
                        {card.methodologies && (
                            <div className="flex items-center">
                                <span className="font-medium">{card.methodologies.length}</span>
                                <span className="ml-1">methodologies</span>
                            </div>
                        )}
                        {card.sourceIndexes && card.sourceIndexes.length > 0 && (
                            <div className="hidden sm:flex items-center">
                                <span className="font-medium">Indexes:</span>
                                <span className="ml-1 truncate max-w-[150px] sm:max-w-none">{card.sourceIndexes.join(', ')}</span>
                            </div>
                        )}
                    </div>

                    {/* Card Iframe - Responsive */}
                    <div className="mb-4 sm:mb-6 rounded-md overflow-hidden border">
                        <iframe
                            id="tako-iframe"
                            src={card.embedUrl}
                            className="w-full"
                            style={{
                                height: `${iframeHeight}px`,
                                minHeight: isMobile ? '250px' : '350px',
                                maxHeight: isMobile ? '50vh' : '70vh'
                            }}
                            frameBorder="0"
                            allowFullScreen
                            loading="lazy"
                        ></iframe>
                    </div>

                    {/* Grounding Toggle - Responsive */}
                    <Button
                        onClick={() => setShowGrounding(!showGrounding)}
                        variant="outline"
                        className="mb-3 sm:mb-4 w-full sm:w-auto flex items-center justify-center"
                    >
                        <Info className="h-4 w-4 mr-2" />
                        <span>{showGrounding ? 'Hide Details' : 'Show Details'}</span>
                        {showGrounding ?
                            <ChevronUp className="h-4 w-4 ml-2" /> :
                            <ChevronDown className="h-4 w-4 ml-2" />
                        }
                    </Button>

                    {/* Grounding Information - Responsive */}
                    {showGrounding && (
                        <div className="space-y-3 sm:space-y-4">
                            {/* Description */}
                            <div className="p-3 sm:p-4 bg-gray-50 rounded-md">
                                <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Description</h3>
                                <p className="text-xs sm:text-sm text-gray-700">{card.description}</p>
                            </div>

                            {/* Sources */}
                            {card.sources && card.sources.length > 0 && (
                                <div className="p-3 sm:p-4 bg-gray-50 rounded-md">
                                    <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Sources</h3>
                                    <div className="space-y-2 sm:space-y-3">
                                        {card.sources.map((source, index) => (
                                            <div key={index} className="text-xs sm:text-sm">
                                                <div className="font-medium">{source.source_name}</div>
                                                <p className="text-gray-700">{source.source_description}</p>
                                                {source.url && (
                                                    <a
                                                        href={source.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline flex items-center mt-1 touch-target"
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
                                <div className="p-3 sm:p-4 bg-gray-50 rounded-md">
                                    <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Methodologies</h3>
                                    <div className="space-y-2 sm:space-y-3">
                                        {card.methodologies.map((methodology, index) => (
                                            <div key={index} className="text-xs sm:text-sm">
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

                {/* Modal Footer - Responsive */}
                <div className="p-3 sm:p-4 border-t flex flex-col xs:flex-row justify-between gap-3">
                    <div className="flex flex-col xs:flex-row gap-2 w-full xs:w-auto">
                        <a
                            href={card.webpageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-md text-xs sm:text-sm font-medium transition-colors bg-transparent border border-gray-300 hover:bg-gray-100 focus-visible:ring-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 h-9 sm:h-10 py-1 sm:py-2 px-3 sm:px-4 w-full xs:w-auto"
                        >
                            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="truncate">View on Tako</span>
                        </a>

                        <a
                            href={`/collections/${username}/${card.cardId}`}
                            className="inline-flex items-center justify-center rounded-md text-xs sm:text-sm font-medium transition-colors bg-transparent border border-gray-300 hover:bg-gray-100 focus-visible:ring-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 h-9 sm:h-10 py-1 sm:py-2 px-3 sm:px-4 w-full xs:w-auto"
                        >
                            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span>Permalink</span>
                        </a>
                    </div>

                    <Button
                        onClick={onClose}
                        variant="default"
                        className="w-full xs:w-auto"
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
}

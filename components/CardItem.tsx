import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef, useContext } from 'react';
import { Calendar, Search, ExternalLink } from 'lucide-react';
import { Card } from '@/hooks/useCards';
import { useHoverIntent } from '@/hooks/useHoverIntent';
import { usePreloadCache } from '@/hooks/usePreloadCache';
import { getCardHoverStyle, getStaggeredDelay } from '@/lib/animations';
import { useIframePrerender } from '@/hooks/useIframePrerender';

// Define image dimensions for optimization
const IMAGE_DIMENSIONS = {
    width: 640,
    height: 360, // 16:9 aspect ratio
};

// Placeholder blur data URL (light gray)
const PLACEHOLDER_BLUR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjM2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmMWYxIi8+PC9zdmc+';

interface CardItemProps {
    card: Card;
    username: string;
    onClick?: () => void;
    onHover?: () => void;
    priority?: boolean; // For above-the-fold images
    index?: number; // To determine if card is above the fold
}

export function CardItem({
    card,
    username,
    onClick,
    onHover,
    priority = false,
    index = 0
}: CardItemProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isPreloaded, setIsPreloaded] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    // Get preload cache functions
    const { preloadImage, preloadIframe } = usePreloadCache();

    // Use hover intent detection
    const { isHovering, hoverProps } = useHoverIntent({
        delay: 150, // 150ms delay before considering it an intentional hover
        sensitivity: 7 // How many pixels the mouse needs to move to reset the timer
    });

    // Determine if this card should have priority loading (first 4 cards)
    const shouldPrioritize = priority || index < 4;

    // Use Intersection Observer to detect when card enters viewport
    useEffect(() => {
        if (typeof window === 'undefined' || !window.IntersectionObserver) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' } // Start loading when within 200px of viewport
        );

        if (cardRef.current) observer.observe(cardRef.current);

        return () => {
            if (cardRef.current) observer.unobserve(cardRef.current);
        };
    }, [card.id]);

    // Get iframe prerendering functions
    const { prerenderIframe, isIframePrerendered } = useIframePrerender();

    // Preload resources when hovering
    useEffect(() => {
        if (isHovering && !isPreloaded) {
            // Preload high-res image
            if (card.imageUrl) {
                preloadImage(card.imageUrl);
            }

            // Preload embed iframe if available
            if (card.embedUrl) {
                // Standard preloading
                preloadIframe(card.embedUrl);

                // Advanced prerendering - actually render the iframe in a hidden container
                prerenderIframe(card.id, card.embedUrl);
            }

            // Call onHover callback if provided
            if (onHover) {
                onHover();
            }

            setIsPreloaded(true);
        }
    }, [isHovering, isPreloaded, card, preloadImage, preloadIframe, prerenderIframe, onHover]);

    const handleClick = (e: React.MouseEvent) => {
        if (onClick) {
            e.preventDefault();
            onClick();
        }
    };

    // Calculate staggered animation delay based on index
    const animationDelay = getStaggeredDelay(index, 30); // 30ms between each card

    return (
        <div
            ref={cardRef}
            id={`card-${card.id}`}
            className={`relative bg-white rounded-lg overflow-hidden border border-gray-200 card-hover-transition ${isHovering ? 'card-hover-active' : ''} animate-fadeIn`}
            style={{
                ...getCardHoverStyle(isHovering),
                ...animationDelay
            }}
            {...hoverProps}
        >
            {/* Permalink icon in the corner */}
            <Link
                href={`/collections/${username}/${card.cardId}`}
                className="absolute top-2 right-2 z-10 p-1.5 bg-white bg-opacity-75 rounded-full hover:bg-opacity-100 transition-all"
                onClick={(e) => e.stopPropagation()}
                aria-label={`View details for ${card.title}`}
            >
                <ExternalLink className="h-4 w-4 text-gray-600" />
            </Link>

            {/* Main card content that opens the modal */}
            <div
                className="cursor-pointer"
                onClick={handleClick}
            >
                {/* Card Image with optimization */}
                <div className="relative aspect-video bg-gray-100">
                    {(isVisible || shouldPrioritize) && (
                        <Image
                            src={card.imageUrl || "/placeholder.svg"}
                            alt={card.title}
                            width={IMAGE_DIMENSIONS.width}
                            height={IMAGE_DIMENSIONS.height}
                            className={`object-cover transition-all duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${isHovering ? 'scale-105' : 'scale-100'}`}
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            priority={shouldPrioritize}
                            placeholder="blur"
                            blurDataURL={PLACEHOLDER_BLUR}
                            onLoad={() => setIsLoaded(true)}
                            style={{
                                width: '100%',
                                height: 'auto',
                                aspectRatio: '16/9',
                                transition: 'transform 0.3s ease-in-out'
                            }}
                        />
                    )}

                    {/* Shimmer overlay while loading */}
                    {!isLoaded && (
                        <div className="absolute inset-0 animate-shimmer" />
                    )}
                </div>

                {/* Card Content */}
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{card.title}</h3>

                    <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Search className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="line-clamp-1">{card.query}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span>{new Date(card.createdAt).toLocaleDateString()}</span>
                        </div>

                        {card.sources && card.sources.length > 0 && (
                            <div className="flex items-center">
                                <span className="font-medium">{card.sources.length}</span>
                                <span className="ml-1">sources</span>
                            </div>
                        )}

                        {card.methodologies && card.methodologies.length > 0 && (
                            <div className="flex items-center">
                                <span className="font-medium">{card.methodologies.length}</span>
                                <span className="ml-1">methodologies</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface PrerenderedIframe {
    id: string;
    iframe: HTMLIFrameElement;
    ready: boolean;
    timestamp: number;
}

/**
 * Hook for managing pre-rendered iframes
 * This allows charts to be rendered in hidden iframes before they're needed
 */
export function useIframePrerender() {
    const [prerenderedIframes, setPrerenderedIframes] = useState<Map<string, PrerenderedIframe>>(new Map());
    const containerRef = useRef<HTMLDivElement | null>(null);
    const maxCachedIframes = 10; // Maximum number of iframes to keep in memory

    // Create hidden container for iframes
    useEffect(() => {
        // Create container if it doesn't exist
        if (!containerRef.current && typeof document !== 'undefined') {
            const container = document.createElement('div');
            container.id = 'prerender-iframe-container';
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.width = '900px'; // Match expected width
            container.style.height = '500px'; // Match expected height
            container.style.visibility = 'hidden';
            container.style.overflow = 'hidden';
            container.style.pointerEvents = 'none';
            container.setAttribute('aria-hidden', 'true');
            document.body.appendChild(container);
            containerRef.current = container;
        }

        // Cleanup on unmount
        return () => {
            if (containerRef.current) {
                document.body.removeChild(containerRef.current);
                containerRef.current = null;
            }
        };
    }, []);

    // Clean up old iframes to prevent memory leaks
    useEffect(() => {
        const cleanupInterval = setInterval(() => {
            if (prerenderedIframes.size > maxCachedIframes) {
                // Sort by timestamp (oldest first)
                const sortedEntries = Array.from(prerenderedIframes.entries())
                    .sort((a, b) => a[1].timestamp - b[1].timestamp);

                // Remove oldest entries until we're under the limit
                const entriesToRemove = sortedEntries.slice(0, prerenderedIframes.size - maxCachedIframes);

                setPrerenderedIframes(prevIframes => {
                    const newIframes = new Map(prevIframes);

                    entriesToRemove.forEach(([id]) => {
                        newIframes.delete(id);
                    });

                    return newIframes;
                });

                // Remove iframe elements from DOM
                if (containerRef.current) {
                    entriesToRemove.forEach(([_, entry]) => {
                        try {
                            containerRef.current?.removeChild(entry.iframe);
                        } catch (e) {
                            // Ignore errors if iframe was already removed
                        }
                    });
                }
            }
        }, 60000); // Check every minute

        return () => clearInterval(cleanupInterval);
    }, [prerenderedIframes]);

    // Prerender an iframe
    const prerenderIframe = useCallback((id: string, url: string) => {
        // Skip if already prerendered
        if (prerenderedIframes.has(id) || !containerRef.current) return;

        // Create iframe
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.width = '900px';
        iframe.height = '500px';
        iframe.style.border = 'none';
        iframe.id = `prerender-${id}`;

        // Add to container
        containerRef.current.appendChild(iframe);

        // Add to state
        setPrerenderedIframes(prevIframes => {
            const newIframes = new Map(prevIframes);
            newIframes.set(id, {
                id,
                iframe,
                ready: false,
                timestamp: Date.now()
            });
            return newIframes;
        });

        // Mark as ready when loaded
        iframe.onload = () => {
            setPrerenderedIframes(prevIframes => {
                const newIframes = new Map(prevIframes);
                const existing = newIframes.get(id);
                if (existing) {
                    newIframes.set(id, {
                        ...existing,
                        ready: true
                    });
                }
                return newIframes;
            });
        };
    }, [prerenderedIframes]);

    // Get a prerendered iframe
    const getPrerenderedIframe = useCallback((id: string) => {
        return prerenderedIframes.get(id);
    }, [prerenderedIframes]);

    // Check if an iframe is prerendered
    const isIframePrerendered = useCallback((id: string) => {
        return prerenderedIframes.has(id) && prerenderedIframes.get(id)?.ready === true;
    }, [prerenderedIframes]);

    // Update timestamp to keep iframe in cache longer
    const touchIframe = useCallback((id: string) => {
        setPrerenderedIframes(prevIframes => {
            const newIframes = new Map(prevIframes);
            const existing = newIframes.get(id);
            if (existing) {
                newIframes.set(id, {
                    ...existing,
                    timestamp: Date.now()
                });
            }
            return newIframes;
        });
    }, []);

    return {
        prerenderIframe,
        getPrerenderedIframe,
        isIframePrerendered,
        touchIframe
    };
}

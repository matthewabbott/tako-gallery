'use client';

import { useState, useCallback, useRef } from 'react';

interface HoverIntentOptions {
    delay?: number;
    sensitivity?: number;
}

export function useHoverIntent({
    delay = 150,
    sensitivity = 7
}: HoverIntentOptions = {}) {
    const [isHovering, setIsHovering] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const positionRef = useRef<{ x: number; y: number } | null>(null);
    const intentionalHover = useRef(false);

    // Clear any existing timer
    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    // Handle mouse enter
    const handleMouseEnter = useCallback((e: React.MouseEvent) => {
        clearTimer();

        // Store initial position
        positionRef.current = { x: e.clientX, y: e.clientY };
        intentionalHover.current = false;

        // Set timer to check for intent
        timerRef.current = setTimeout(() => {
            intentionalHover.current = true;
            setIsHovering(true);
        }, delay);
    }, [delay, clearTimer]);

    // Handle mouse move
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        // If already determined to be intentional, do nothing
        if (intentionalHover.current) return;

        // If we have a previous position, check if mouse has moved significantly
        if (positionRef.current) {
            const { x, y } = positionRef.current;
            const distanceX = Math.abs(e.clientX - x);
            const distanceY = Math.abs(e.clientY - y);

            // If mouse has moved more than sensitivity threshold, reset timer
            if (distanceX > sensitivity || distanceY > sensitivity) {
                clearTimer();
                positionRef.current = { x: e.clientX, y: e.clientY };

                // Restart timer
                timerRef.current = setTimeout(() => {
                    intentionalHover.current = true;
                    setIsHovering(true);
                }, delay);
            }
        }
    }, [delay, sensitivity, clearTimer]);

    // Handle mouse leave
    const handleMouseLeave = useCallback(() => {
        clearTimer();
        positionRef.current = null;
        intentionalHover.current = false;
        setIsHovering(false);
    }, [clearTimer]);

    return {
        isHovering,
        hoverProps: {
            onMouseEnter: handleMouseEnter,
            onMouseMove: handleMouseMove,
            onMouseLeave: handleMouseLeave,
        },
        // Individual handlers for more control
        handleMouseEnter,
        handleMouseMove,
        handleMouseLeave,
    };
}

'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'; // Placeholder icons

export function ThemeToggleButton() {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme, toggleTheme } = useTheme();

    // When mounted on client, now we can show the UI
    useEffect(() => setMounted(true), []);

    if (!mounted) {
        // Render a placeholder or null to avoid hydration mismatch and incorrect icon display
        // A simple div with fixed size can prevent layout shift
        return <div className="h-10 w-10 p-2 rounded-md" />; // Matches button size approx.
    }

    const handleToggle = () => {
        toggleTheme();
    };

    return (
        <button
            onClick={handleToggle}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-tako-dark-border transition-colors"
            aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
        >
            {resolvedTheme === 'dark' ? (
                <SunIcon className="h-6 w-6 text-yellow-400" />
            ) : (
                <MoonIcon className="h-6 w-6 text-gray-700 dark:text-tako-dark-text-primary" />
                // Added dark:text for MoonIcon in case it ever renders on a dark bg before toggle
            )}
        </button>
    );
}

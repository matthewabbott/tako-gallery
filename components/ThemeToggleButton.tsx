'use client';

import { useTheme } from '@/context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'; // Placeholder icons

export function ThemeToggleButton() {
    const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

    // Ensure the button only renders client-side where localStorage and window are available
    // or that resolvedTheme is correctly initialized for SSR if needed.
    // For now, relying on the context's handling.

    const handleToggle = () => {
        toggleTheme();
    };

    // Or, if you want to cycle through light, dark, system:
    // const handleSetTheme = (newTheme: 'light' | 'dark' | 'system') => {
    //   setTheme(newTheme);
    // };

    return (
        <button
            onClick={handleToggle}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-tako-dark-border transition-colors"
            aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
        >
            {resolvedTheme === 'dark' ? (
                <SunIcon className="h-6 w-6 text-yellow-400" />
            ) : (
                <MoonIcon className="h-6 w-6 text-gray-700" />
            )}
        </button>
    );
}

'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme; // The user's preference ('light', 'dark', or 'system')
    resolvedTheme: ResolvedTheme; // The actual theme being applied ('light' or 'dark')
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void; // Toggles between light and dark, sets preference away from 'system'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
}

export const ThemeProvider = ({
    children,
    defaultTheme = 'system',
    storageKey = 'tako-gallery-theme',
}: ThemeProviderProps) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        if (typeof window === 'undefined') {
            return defaultTheme;
        }
        try {
            const storedTheme = localStorage.getItem(storageKey) as Theme | null;
            return storedTheme || defaultTheme;
        } catch (e) {
            // If localStorage is unavailable
            return defaultTheme;
        }
    });

    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
        if (typeof window === 'undefined') {
            // For SSR, we can't know the system theme. Default to light or a configurable SSR theme.
            // Or, better, don't render theme-dependent UI on SSR or use a placeholder.
            // For now, let's assume light for SSR if theme is 'system'.
            return defaultTheme === 'dark' ? 'dark' : 'light';
        }
        if (theme === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return theme;
    });

    const applyTheme = useCallback((currentTheme: Theme) => {
        let newResolvedTheme: ResolvedTheme;
        if (currentTheme === 'system') {
            newResolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        } else {
            newResolvedTheme = currentTheme;
        }
        setResolvedTheme(newResolvedTheme);

        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(newResolvedTheme);

        try {
            localStorage.setItem(storageKey, currentTheme); // Store user's preference
        } catch (e) {
            // localStorage not available
        }
    }, [storageKey]);


    useEffect(() => {
        if (typeof window !== 'undefined') {
            applyTheme(theme);
        }
    }, [theme, applyTheme]);

    // Listen to system theme changes if current theme is 'system'
    useEffect(() => {
        if (typeof window === 'undefined' || theme !== 'system') {
            return;
        }
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            applyTheme('system'); // Re-evaluate and apply system theme
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme, applyTheme]);


    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    const toggleTheme = () => {
        // If current theme is 'system', toggle based on resolved theme, then set preference
        // Otherwise, just toggle between light and dark
        setThemeState((prevTheme) => {
            if (prevTheme === 'system') {
                return resolvedTheme === 'light' ? 'dark' : 'light';
            }
            return prevTheme === 'light' ? 'dark' : 'light';
        });
    };

    const value = {
        theme, // User's preference
        resolvedTheme, // Actual theme applied
        setTheme,
        toggleTheme,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

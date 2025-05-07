import { ApiResponse } from './types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names with Tailwind CSS classes
 * @param inputs Class names to merge
 * @returns Merged class names
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Create a successful API response
 * @param data The data to include in the response
 * @returns An ApiResponse object with success: true and the provided data
 */
export function createSuccessResponse<T>(data: T): ApiResponse<T> {
    return {
        success: true,
        data,
    };
}

/**
 * Create an error API response
 * @param error The error message
 * @param status Optional HTTP status code (for use with NextResponse)
 * @returns An ApiResponse object with success: false and the provided error
 */
export function createErrorResponse(error: string): ApiResponse<never> {
    return {
        success: false,
        error,
    };
}

/**
 * Validate that a username meets the required format
 * @param username The username to validate
 * @returns True if the username is valid, false otherwise
 */
export function isValidUsername(username: string): boolean {
    if (!username || typeof username !== 'string') {
        return false;
    }

    // Username requirements:
    // - 3-30 characters
    // - Only letters, numbers, underscores, and hyphens
    const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
    return usernameRegex.test(username);
}

/**
 * Format a date for display
 * @param date The date to format
 * @returns A formatted date string (e.g., "Jan 1, 2023")
 */
export function formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Truncate a string to a specified length
 * @param str The string to truncate
 * @param length The maximum length
 * @returns The truncated string with "..." appended if truncated
 */
export function truncateString(str: string, length: number): string {
    if (!str || str.length <= length) {
        return str;
    }

    return `${str.substring(0, length)}...`;
}

/**
 * Generate a random string of a specified length
 * Useful for generating temporary IDs or tokens
 * @param length The length of the string to generate
 * @returns A random string
 */
export function generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

/**
 * Sleep for a specified number of milliseconds
 * Useful for adding delays in async functions
 * @param ms The number of milliseconds to sleep
 * @returns A promise that resolves after the specified time
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
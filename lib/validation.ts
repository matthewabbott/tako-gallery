/**
 * Validation utilities for the application
 */

/**
 * Validation result interface
 */
export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

/**
 * Validate a username
 * @param username The username to validate
 * @returns A validation result
 */
export function validateUsername(username: string): ValidationResult {
    if (!username) {
        return {
            isValid: false,
            error: 'Username is required',
        };
    }

    if (typeof username !== 'string') {
        return {
            isValid: false,
            error: 'Username must be a string',
        };
    }

    // Trim the username
    const trimmedUsername = username.trim();

    // Check length
    if (trimmedUsername.length < 3) {
        return {
            isValid: false,
            error: 'Username must be at least 3 characters long',
        };
    }

    if (trimmedUsername.length > 30) {
        return {
            isValid: false,
            error: 'Username must be at most 30 characters long',
        };
    }

    // Check format (letters, numbers, underscores, and hyphens only)
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(trimmedUsername)) {
        return {
            isValid: false,
            error: 'Username can only contain letters, numbers, underscores, and hyphens',
        };
    }

    // Check if username starts with a letter or number
    if (!/^[a-zA-Z0-9]/.test(trimmedUsername)) {
        return {
            isValid: false,
            error: 'Username must start with a letter or number',
        };
    }

    // Check for reserved usernames
    const reservedUsernames = [
        'admin', 'administrator', 'api', 'app', 'dashboard', 'login', 'logout',
        'profile', 'register', 'settings', 'system', 'tako', 'test', 'user',
    ];

    if (reservedUsernames.includes(trimmedUsername.toLowerCase())) {
        return {
            isValid: false,
            error: 'This username is reserved',
        };
    }

    return {
        isValid: true,
    };
}

/**
 * Validate a query string
 * @param query The query to validate
 * @returns A validation result
 */
export function validateQuery(query: string): ValidationResult {
    if (!query) {
        return {
            isValid: false,
            error: 'Query is required',
        };
    }

    if (typeof query !== 'string') {
        return {
            isValid: false,
            error: 'Query must be a string',
        };
    }

    // Trim the query
    const trimmedQuery = query.trim();

    // Check length
    if (trimmedQuery.length < 2) {
        return {
            isValid: false,
            error: 'Query must be at least 2 characters long',
        };
    }

    if (trimmedQuery.length > 500) {
        return {
            isValid: false,
            error: 'Query must be at most 500 characters long',
        };
    }

    return {
        isValid: true,
    };
}

/**
 * Validate an API key
 * @param apiKey The API key to validate
 * @returns A validation result
 */
export function validateApiKey(apiKey: string): ValidationResult {
    if (!apiKey) {
        return {
            isValid: false,
            error: 'API key is required',
        };
    }

    if (typeof apiKey !== 'string') {
        return {
            isValid: false,
            error: 'API key must be a string',
        };
    }

    // Check length
    if (apiKey.length < 20) {
        return {
            isValid: false,
            error: 'API key must be at least 20 characters long',
        };
    }

    if (apiKey.length > 100) {
        return {
            isValid: false,
            error: 'API key must be at most 100 characters long',
        };
    }

    return {
        isValid: true,
    };
}
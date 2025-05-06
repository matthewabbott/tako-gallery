import bcrypt from 'bcrypt';

/**
 * Hash an API key for secure storage
 * @param apiKey The raw API key to hash
 * @returns A promise that resolves to the hashed API key
 */
export async function hashApiKey(apiKey: string): Promise<string> {
    // Use a salt rounds of 10 for a good balance of security and performance
    const saltRounds = 10;
    return bcrypt.hash(apiKey, saltRounds);
}

/**
 * Verify an API key against a stored hash
 * @param apiKey The raw API key to verify
 * @param storedHash The stored hash to compare against
 * @returns A promise that resolves to true if the API key matches the hash
 */
export async function verifyApiKey(apiKey: string, storedHash: string): Promise<boolean> {
    return bcrypt.compare(apiKey, storedHash);
}

/**
 * Validate that a string is a valid API key format
 * This is a basic validation to ensure the API key is not empty and has a reasonable length
 * @param apiKey The API key to validate
 * @returns True if the API key is valid, false otherwise
 */
export function isValidApiKeyFormat(apiKey: string): boolean {
    if (!apiKey || typeof apiKey !== 'string') {
        return false;
    }

    // Tako API keys are typically long strings
    // This is a basic validation to ensure the API key has a reasonable length
    return apiKey.length >= 20 && apiKey.length <= 100;
}

/**
 * Get a masked version of an API key for display purposes
 * @param apiKey The API key to mask
 * @returns A masked version of the API key (e.g., "sk_1234...5678")
 */
export function maskApiKey(apiKey: string): string {
    if (!apiKey || apiKey.length < 8) {
        return '***';
    }

    const prefix = apiKey.substring(0, 4);
    const suffix = apiKey.substring(apiKey.length - 4);
    return `${prefix}...${suffix}`;
}
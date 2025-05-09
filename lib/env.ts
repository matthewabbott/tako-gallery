/**
 * Environment variable validation
 * This ensures that all required environment variables are set
 */

// Define the shape of our environment variables
type Env = {
    MONGODB_URI: string;
    NEXT_PUBLIC_APP_URL: string;
};

/**
 * Get the application URL based on the environment
 * - Uses VERCEL_URL in Vercel deployments
 * - Falls back to NEXT_PUBLIC_APP_URL if explicitly set
 * - Defaults to localhost for local development
 */
function getAppUrl(): string {
    // If NEXT_PUBLIC_APP_URL is explicitly set, use it
    if (process.env.NEXT_PUBLIC_APP_URL) {
        return process.env.NEXT_PUBLIC_APP_URL;
    }

    // If in Vercel environment, use VERCEL_URL
    if (process.env.VERCEL_URL) {
        // VERCEL_URL doesn't include protocol, so add https://
        return `https://${process.env.VERCEL_URL}`;
    }

    // Default for local development
    return 'http://localhost:3000';
}

// Function to validate environment variables
function validateEnv(): Env {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not set');
    }

    const appUrl = getAppUrl();

    return {
        MONGODB_URI: process.env.MONGODB_URI,
        NEXT_PUBLIC_APP_URL: appUrl,
    };
}

// Export validated environment variables
export const env = validateEnv();

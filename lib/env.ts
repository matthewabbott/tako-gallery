/**
 * Environment variable validation
 * This ensures that all required environment variables are set
 */

// Define the shape of our environment variables
type Env = {
    MONGODB_URI: string;
    NEXT_PUBLIC_APP_URL: string;
};

// Function to validate environment variables
function validateEnv(): Env {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not set');
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    return {
        MONGODB_URI: process.env.MONGODB_URI,
        NEXT_PUBLIC_APP_URL: appUrl,
    };
}

// Export validated environment variables
export const env = validateEnv();
import { NextResponse } from 'next/server';
import { createErrorResponse } from './utils';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number = 500) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

/**
 * Handle API errors and return an appropriate response
 * @param error The error to handle
 * @param defaultMessage The default error message
 * @returns A NextResponse with the error details
 */
export function handleApiError(error: unknown, defaultMessage: string = 'An error occurred'): NextResponse {
    console.error('API error:', error);

    // If it's our custom ApiError, use its status and message
    if (error instanceof ApiError) {
        return NextResponse.json(
            createErrorResponse(error.message),
            { status: error.status }
        );
    }

    // If it's a standard Error, use its message
    if (error instanceof Error) {
        // Check for common error messages and provide appropriate status codes
        if (error.message.includes('Invalid API key')) {
            return NextResponse.json(
                createErrorResponse(error.message),
                { status: 401 }
            );
        }

        if (error.message.includes('Rate limit')) {
            return NextResponse.json(
                createErrorResponse(error.message),
                { status: 429 }
            );
        }

        return NextResponse.json(
            createErrorResponse(error.message),
            { status: 500 }
        );
    }

    // For unknown errors, use the default message
    return NextResponse.json(
        createErrorResponse(defaultMessage),
        { status: 500 }
    );
}

/**
 * Create a new ApiError
 * @param message The error message
 * @param status The HTTP status code
 * @returns A new ApiError
 */
export function createApiError(message: string, status: number = 500): ApiError {
    return new ApiError(message, status);
}

/**
 * Throw an ApiError with the given message and status
 * @param message The error message
 * @param status The HTTP status code
 */
export function throwApiError(message: string, status: number = 500): never {
    throw new ApiError(message, status);
}
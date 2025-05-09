import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { hashApiKey, isValidApiKeyFormat } from '@/lib/apikey';
import { createSuccessResponse, createErrorResponse } from '@/lib/utils';
import { handleApiError } from '@/lib/error';

export async function POST(request: Request) {
    try {
        // Parse request body
        const body = await request.json();
        const { apiKey } = body;

        // Validate API key format
        if (!apiKey || !isValidApiKeyFormat(apiKey)) {
            return NextResponse.json(
                createErrorResponse('Invalid API key format'),
                { status: 400 }
            );
        }

        // Connect to database
        await connectToDatabase();

        // Hash the API key for database lookup
        const apiKeyHash = await hashApiKey(apiKey);

        // Find user by API key hash
        const user = await User.findOne({ apiKeyHash });

        // If no user found, return error
        if (!user) {
            return NextResponse.json(
                createErrorResponse('No collection found for this API key'),
                { status: 404 }
            );
        }

        // Return the user's username
        return NextResponse.json(
            createSuccessResponse({
                username: user.username,
                createdAt: user.createdAt
            })
        );
    } catch (error) {
        console.error('Find collection by API key error:', error);
        return handleApiError(error, 'An error occurred while finding collection');
    }
}

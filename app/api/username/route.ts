import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { hashApiKey, isValidApiKeyFormat } from '@/lib/apiKey';
import { createSuccessResponse, createErrorResponse, isValidUsername } from '@/lib/utils';
import { handleApiError } from '@/lib/error';
import { validateUsername } from '@/lib/validation';

export async function POST(request: Request) {
    try {
        // Parse request body
        const body = await request.json();
        const { apiKey, username } = body;

        // Validate inputs
        if (!apiKey || !isValidApiKeyFormat(apiKey)) {
            return NextResponse.json(
                createErrorResponse('Invalid API key format'),
                { status: 400 }
            );
        }

        // Validate username
        const usernameValidation = validateUsername(username);
        if (!usernameValidation.isValid) {
            return NextResponse.json(
                createErrorResponse(usernameValidation.error || 'Invalid username'),
                { status: 400 }
            );
        }

        // Connect to database
        await connectToDatabase();

        // Hash the API key for database lookup
        const apiKeyHash = await hashApiKey(apiKey);

        // Check if user exists in database
        const user = await User.findOne({ apiKeyHash });

        if (!user) {
            return NextResponse.json(
                createErrorResponse('User not found. Please make a search query first.'),
                { status: 404 }
            );
        }

        // Check if username is already taken (by a different user)
        const existingUser = await User.findOne({
            username: username.toLowerCase(),
            _id: { $ne: user._id } // Exclude the current user
        });

        if (existingUser) {
            return NextResponse.json(
                createErrorResponse('Username is already taken'),
                { status: 409 }
            );
        }

        // Update the username
        user.username = username.toLowerCase();
        await user.save();

        // Return the response
        return NextResponse.json(
            createSuccessResponse({
                username: user.username,
                collectionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${user.username}`,
            })
        );
    } catch (error) {
        console.error('Username API error:', error);
        return handleApiError(error, 'An error occurred while updating username');
    }
}

// GET endpoint to check username availability
export async function GET(request: Request) {
    try {
        // Get username from query parameters
        const { searchParams } = new URL(request.url);
        const username = searchParams.get('username');

        if (!username) {
            return NextResponse.json(
                createErrorResponse('Username is required'),
                { status: 400 }
            );
        }

        // Validate username format
        const usernameValidation = validateUsername(username);
        if (!usernameValidation.isValid) {
            return NextResponse.json(
                createSuccessResponse({
                    available: false,
                    error: usernameValidation.error,
                })
            );
        }

        // Connect to database
        await connectToDatabase();

        // Check if username exists
        const existingUser = await User.findOne({ username: username.toLowerCase() });

        return NextResponse.json(
            createSuccessResponse({
                available: !existingUser,
            })
        );
    } catch (error) {
        console.error('Username availability check error:', error);
        return handleApiError(error, 'An error occurred while checking username availability');
    }
}
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Card } from '@/models/Card';
import { hashApiKey, isValidApiKeyFormat } from '@/lib/apikey';
import { createSuccessResponse, createErrorResponse } from '@/lib/utils';
import { handleApiError } from '@/lib/error';

export async function DELETE(
    request: Request,
    { params }: { params: { username: string } }
) {
    try {
        const username = params.username;

        // Get API key from request body
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

        // Find the user/collection by username
        const user = await User.findOne({ username });

        if (!user) {
            return NextResponse.json(
                createErrorResponse('Collection not found'),
                { status: 404 }
            );
        }

        // Hash the API key for verification
        const apiKeyHash = await hashApiKey(apiKey);

        // Verify that the API key matches the collection's API key hash
        if (apiKeyHash !== user.apiKeyHash) {
            return NextResponse.json(
                createErrorResponse('You are not authorized to delete this collection'),
                { status: 403 }
            );
        }

        // Delete all cards associated with this collection
        const deleteCardsResult = await Card.deleteMany({ apiKeyHash: user.apiKeyHash });

        // Delete the collection (User document)
        await User.deleteOne({ _id: user._id });

        // Return success response
        return NextResponse.json(
            createSuccessResponse({
                message: 'Collection deleted successfully',
                username: user.username,
                cardsDeleted: deleteCardsResult.deletedCount,
            })
        );
    } catch (error) {
        console.error('Delete collection API error:', error);
        return handleApiError(error, 'An error occurred while deleting the collection');
    }
}

export async function GET(
    request: Request,
    { params }: { params: { username: string } }
) {
    try {
        const username = params.username;

        // Connect to database
        await connectToDatabase();

        // Find the user/collection by username
        const user = await User.findOne({ username });

        if (!user) {
            return NextResponse.json(
                createErrorResponse('Collection not found'),
                { status: 404 }
            );
        }

        // Get card count for this collection
        const cardCount = await Card.countDocuments({ apiKeyHash: user.apiKeyHash });

        // Return the collection info
        return NextResponse.json(
            createSuccessResponse({
                username: user.username,
                createdAt: user.createdAt,
                cardCount,
            })
        );
    } catch (error) {
        console.error('Get collection API error:', error);
        return handleApiError(error, 'An error occurred while retrieving the collection');
    }
}

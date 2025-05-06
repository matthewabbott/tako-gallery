// app/api/test-tako/route.ts
import { NextResponse } from 'next/server';
import { searchKnowledge, validateTakoApiKey } from '@/lib/tako-api';

export async function GET(request: Request) {
    // Get the API key and query from the query parameters
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('key');
    const query = searchParams.get('query') || 'test';

    if (!apiKey) {
        return NextResponse.json(
            { success: false, message: 'API key is required' },
            { status: 400 }
        );
    }

    try {
        // Validate the API key
        const isValid = await validateTakoApiKey(apiKey);

        if (!isValid) {
            return NextResponse.json(
                { success: false, message: 'Invalid API key' },
                { status: 401 }
            );
        }

        // Execute a test search
        const searchResult = await searchKnowledge(apiKey, query);

        return NextResponse.json({
            success: true,
            message: 'Tako API integration is working',
            cards: searchResult.outputs.knowledge_cards.map(card => ({
                id: card.card_id,
                title: card.title,
            })),
        });
    } catch (error) {
        console.error('Tako API test error:', error);

        return NextResponse.json(
            { success: false, message: error instanceof Error ? error.message : 'An error occurred' },
            { status: 500 }
        );
    }
}
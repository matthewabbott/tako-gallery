// app/api/test-api-key/route.ts
import { NextResponse } from 'next/server';
import { hashApiKey, verifyApiKey, isValidApiKeyFormat, maskApiKey } from '@/lib/apiKey';

export async function GET(request: Request) {
    // Get the API key from the query parameters
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('key') || 'test_api_key_12345678901234567890';

    try {
        // Test API key utilities
        const isValid = isValidApiKeyFormat(apiKey);
        const masked = maskApiKey(apiKey);
        const hashed = await hashApiKey(apiKey);
        const verified = await verifyApiKey(apiKey, hashed);

        return NextResponse.json({
            success: true,
            apiKey: {
                isValid,
                masked,
                hashed: hashed.substring(0, 10) + '...',
                verified,
            }
        });
    } catch (error) {
        console.error('API key utility error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to test API key utilities' },
            { status: 500 }
        );
    }
}
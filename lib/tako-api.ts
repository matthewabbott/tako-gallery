import axios from 'axios';
import { TakoSearchRequest, TakoSearchResponse } from './types';

// Tako API base URL
const TAKO_API_BASE_URL = 'https://trytako.com/api/v1';

/**
 * Create an axios instance for Tako API requests
 * @param apiKey The Tako API key
 * @returns An axios instance configured for Tako API requests
 */
function createTakoApiClient(apiKey: string) {
    return axios.create({
        baseURL: TAKO_API_BASE_URL,
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
    });
}

/**
 * Execute a knowledge search query using the Tako API
 * @param apiKey The Tako API key
 * @param query The search query text
 * @returns A promise that resolves to the search response
 */
export async function searchKnowledge(apiKey: string, query: string): Promise<TakoSearchResponse> {
    try {
        const client = createTakoApiClient(apiKey);

        const requestData: TakoSearchRequest = {
            inputs: {
                text: query,
            },
            source_indexes: ['tako'],
        };

        const response = await client.post<TakoSearchResponse>(
            '/knowledge_search',
            requestData
        );

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Handle Axios errors
            const status = error.response?.status;
            const message = error.response?.data?.message || error.message;

            if (status === 401) {
                throw new Error('Invalid API key. Please check your Tako API key and try again.');
            } else if (status === 429) {
                throw new Error('Rate limit exceeded. Please try again later.');
            } else {
                throw new Error(`Tako API error (${status}): ${message}`);
            }
        }

        // Handle other errors
        throw error;
    }
}

/**
 * Validate a Tako API key by making a test request
 * @param apiKey The Tako API key to validate
 * @returns A promise that resolves to true if the API key is valid
 */
export async function validateTakoApiKey(apiKey: string): Promise<boolean> {
    try {
        const client = createTakoApiClient(apiKey);

        // Make a simple request to validate the API key
        // We'll use a simple query that should return results quickly
        const requestData: TakoSearchRequest = {
            inputs: {
                text: 'test',
            },
            source_indexes: ['tako'],
        };

        // We only care about the status code, not the actual response
        await client.post('/knowledge_search', requestData);

        return true;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            return false;
        }

        // For other errors, we'll assume the API key might be valid
        // but there was another issue with the request
        console.error('Error validating Tako API key:', error);
        return false;
    }
}
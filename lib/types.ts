// Tako API Types

export interface TakoSource {
    source_name: string;
    source_description: string;
    source_index: string;
    url: string;
}

export interface TakoMethodology {
    methodology_name: string;
    methodology_description: string;
}

export interface TakoKnowledgeCard {
    card_id: string;
    title: string;
    description: string;
    webpage_url: string;
    image_url: string;
    embed_url: string;
    sources: TakoSource[];
    methodologies: TakoMethodology[];
    source_indexes: string[];
}

export interface TakoSearchResponse {
    outputs: {
        knowledge_cards: TakoKnowledgeCard[];
    };
    request_id: string;
}

export interface TakoSearchRequest {
    inputs: {
        text: string;
    };
    source_indexes?: string[];
}

// Application Types

export interface UserData {
    username: string;
    createdAt: Date;
}

export interface CardData {
    id: string;
    cardId: string;
    title: string;
    description: string;
    webpageUrl: string;
    imageUrl: string;
    embedUrl: string;
    sources: TakoSource[];
    methodologies: TakoMethodology[];
    sourceIndexes: string[];
    query: string;
    createdAt: Date;
}

export interface CollectionData {
    username: string;
    cards: CardData[];
    totalCards: number;
}

// API Request/Response Types

export interface SearchRequest {
    apiKey: string;
    query: string;
}

export interface UsernameRequest {
    apiKey: string;
    username: string;
}

export interface DeleteCardRequest {
    apiKey: string;
    cardId: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
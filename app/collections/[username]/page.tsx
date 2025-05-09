import { notFound } from 'next/navigation';
import { CardGrid } from '@/components/CardGrid';
import { CollectionHeader } from '@/components/CollectionHeader';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Card } from '@/models/Card';

interface CollectionPageProps {
    params: {
        username: string;
    };
    searchParams: {
        page?: string;
        search?: string;
        sortField?: string;
        sortOrder?: string;
        cardId?: string;
    };
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
    const username = params.username;
    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    const search = searchParams.search || '';
    const sortField = searchParams.sortField || 'createdAt';
    const sortOrder = searchParams.sortOrder || 'desc';
    const cardId = searchParams.cardId;

    // Connect to database
    await connectToDatabase();

    // Find user by username
    const user = await User.findOne({ username: username.toLowerCase() });

    // If user not found, trigger not-found page
    if (!user) {
        notFound();
    }

    // Get card count for this collection
    const cardCount = await Card.countDocuments({ apiKeyHash: user.apiKeyHash });

    return (
        <div className="container mx-auto px-4 py-8">
            <CollectionHeader
                username={username}
                createdAt={user.createdAt.toString()}
                cardCount={cardCount}
            />

            <CardGrid
                username={username}
                initialPage={page}
                initialSearch={search}
                initialSortField={sortField as any}
                initialSortOrder={sortOrder as any}
                initialCardId={cardId}
            />
        </div>
    );
}

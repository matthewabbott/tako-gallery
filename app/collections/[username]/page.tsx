import { CardGrid } from '@/components/CardGrid';
import { CollectionHeader } from '@/components/CollectionHeader';

interface CollectionPageProps {
    params: {
        username: string;
    };
    searchParams: {
        page?: string;
        search?: string;
        sortField?: string;
        sortOrder?: string;
    };
}

export default function CollectionPage({ params, searchParams }: CollectionPageProps) {
    const username = params.username;
    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    const search = searchParams.search || '';
    const sortField = searchParams.sortField || 'createdAt';
    const sortOrder = searchParams.sortOrder || 'desc';

    return (
        <div className="container mx-auto px-4 py-8">
            <CardGrid
                username={username}
                initialPage={page}
                initialSearch={search}
                initialSortField={sortField as any}
                initialSortOrder={sortOrder as any}
            />
        </div>
    );
}

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
                <div className="flex justify-center mb-6">
                    <AlertTriangle className="h-16 w-16 text-amber-500" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-4">Collection Not Found</h1>

                <p className="text-gray-600 mb-6">
                    The collection you&apos;re looking for doesn&apos;t exist or may have been removed.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/">
                        <Button variant="default">
                            Go to Home
                        </Button>
                    </Link>

                    <Link href="/new-collection">
                        <Button variant="outline">
                            Create New Collection
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

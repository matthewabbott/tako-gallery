export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-5xl mx-auto">
                <div className="h-8 bg-gray-200 rounded w-64 mb-6 animate-pulse"></div>

                {/* Search Bar Skeleton */}
                <div className="mb-8 animate-pulse">
                    <div className="flex gap-2">
                        <div className="h-10 bg-gray-200 rounded flex-grow"></div>
                        <div className="h-10 bg-gray-200 rounded w-24"></div>
                    </div>
                </div>

                {/* Collections Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 animate-pulse">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b">
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                                <div className="flex flex-wrap gap-3">
                                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-1 p-1">
                                <div className="aspect-video bg-gray-200 rounded"></div>
                                <div className="aspect-video bg-gray-200 rounded"></div>
                                <div className="aspect-video bg-gray-200 rounded"></div>
                                <div className="aspect-video bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Skeleton */}
                <div className="flex justify-between items-center mt-8 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                    <div className="flex gap-2">
                        <div className="h-8 bg-gray-200 rounded w-20"></div>
                        <div className="h-8 bg-gray-200 rounded w-24"></div>
                        <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

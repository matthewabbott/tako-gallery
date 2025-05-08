export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Collection Header Skeleton */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 animate-pulse">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <div className="h-4 bg-gray-200 rounded w-40"></div>
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <div className="h-10 bg-gray-200 rounded w-36"></div>
                    </div>
                </div>
            </div>

            {/* Search Bar Skeleton */}
            <div className="mb-6 animate-pulse">
                <div className="flex gap-2">
                    <div className="h-10 bg-gray-200 rounded flex-grow"></div>
                    <div className="h-10 bg-gray-200 rounded w-24"></div>
                </div>
            </div>

            {/* Card Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                        <div className="aspect-video bg-gray-200"></div>
                        <div className="p-4">
                            <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
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
    );
}

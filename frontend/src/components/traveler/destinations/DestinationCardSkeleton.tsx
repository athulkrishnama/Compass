function DestinationCardSkeleton() {
    return (
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
            <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300" />

            <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="h-6 bg-gray-200 rounded w-3/5" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>

                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-4/5" />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-16 bg-gray-200 rounded" />
                        <div className="h-4 w-16 bg-gray-200 rounded" />
                    </div>
                    <div className="h-6 w-12 bg-gray-200 rounded" />
                </div>
            </div>
        </div>
    );
}

export default DestinationCardSkeleton;

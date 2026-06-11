export function RideRequestLoading() {
    return (
        <div className="flex flex-col gap-3 px-5 pb-5">
            <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
            <div className="h-5 w-2/3 bg-gray-100 rounded animate-pulse" />
            <div className="h-5 w-1/2 bg-gray-100 rounded animate-pulse" />
            <div className="h-12 bg-gray-100 rounded-2xl animate-pulse mt-2" />
        </div>
    );
}

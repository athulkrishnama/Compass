import { Skeleton } from "@/components/ui/skeleton";

export const HotelCardSkeleton = () => {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-md border border-zinc-100">
            <Skeleton className="aspect-[4/3] w-full" />

            <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />

                <Skeleton className="h-4 w-1/2 mb-3" />

                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-3" />

                <div className="pt-3 border-t border-zinc-100">
                    <Skeleton className="h-6 w-1/3" />
                </div>
            </div>
        </div>
    );
};

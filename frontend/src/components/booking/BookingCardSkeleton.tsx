import { Skeleton } from "@/components/ui/skeleton";

export function BookingCardSkeleton() {
    return (
        <div className="flex flex-col h-full border border-border/40 rounded-[1.5rem] overflow-hidden bg-background shadow-[0_30px_60px_-20px_rgba(0,0,0,0.3)]">
            {/* Image Placeholder */}
            <Skeleton className="aspect-video rounded-none" />

            {/* Content Placeholder */}
            <div className="flex-1 p-5 flex flex-col">
                <div className="mb-4 space-y-1.5">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5 pt-4 border-t border-border/40">
                    <div className="space-y-1">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="space-y-1 border-l border-border/40 pl-3">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>

                <div className="mt-auto pt-3 flex items-center justify-between">
                    <div className="space-y-1">
                        <Skeleton className="h-3 w-8" />
                        <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-10 w-28 rounded-full" />
                </div>
            </div>
        </div>
    );
}

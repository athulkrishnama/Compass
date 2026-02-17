import { Skeleton } from "@/components/ui/skeleton";

export function BookingCardSkeleton() {
    return (
        <div className="border border-border rounded-2xl overflow-hidden bg-background">
            <div className="flex flex-col sm:flex-row">
                <Skeleton className="sm:w-[200px] h-48 sm:h-auto sm:min-h-[180px] flex-shrink-0 rounded-none" />

                <div className="flex-1 p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-4 w-28" />
                        </div>
                        <div className="space-y-1 text-right">
                            <Skeleton className="h-5 w-24 ml-auto" />
                            <Skeleton className="h-3 w-20 ml-auto" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-9 w-28 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}

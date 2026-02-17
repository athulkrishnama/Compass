import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BookingCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
                <Skeleton className="md:w-64 h-48 md:h-auto" />

                <div className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1 space-y-4">
                            <div>
                                <Skeleton className="h-6 w-48 mb-2" />
                                <Skeleton className="h-4 w-32" />
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="space-y-2">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-4 w-28" />
                                </div>
                                <Skeleton className="h-4 w-4" />
                                <div className="space-y-2">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-4 w-28" />
                                </div>
                            </div>

                            <Skeleton className="h-4 w-24" />
                        </div>

                        <div className="flex flex-col items-end gap-3">
                            <div className="space-y-1">
                                <Skeleton className="h-8 w-24" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                            <Skeleton className="h-9 w-28" />
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

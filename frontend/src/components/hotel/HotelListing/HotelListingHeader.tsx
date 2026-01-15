import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface HotelListingHeaderProps {
    count: number;
}

export function HotelListingHeader({ count }: HotelListingHeaderProps) {
    return (
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">
                    Hotel Management
                </h1>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    {count} {count === 1 ? "Property" : "Properties"} Managed
                </p>
            </div>
            <Button asChild className="rounded-full px-6">
                <Link to="/hotel/hotels/add">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Hotel
                </Link>
            </Button>
        </header>
    );
}

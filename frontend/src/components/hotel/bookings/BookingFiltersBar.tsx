import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKeys from "@/utils/i18n/translationKey";
import { BookingStatus } from "@/enums/bookingStatus";

interface StatusTab {
    label: string;
    value: BookingStatus | undefined;
}

interface BookingFiltersBarProps {
    statusTabs: StatusTab[];
    selectedStatus: string | undefined;
    onStatusChange: (status: string | undefined) => void;
    search: string;
    onSearchChange: (value: string) => void;
}

export default function BookingFiltersBar({
    statusTabs,
    selectedStatus,
    onStatusChange,
    search,
    onSearchChange,
}: BookingFiltersBarProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-3 mb-6">
            {/* Status tabs – horizontally scrollable on mobile */}
            <div className="flex gap-2 overflow-x-auto pb-1 hide-scroll-bar">
                {statusTabs.map((tab) => (
                    <Button
                        key={tab.label}
                        variant={
                            selectedStatus === tab.value ? "default" : "outline"
                        }
                        size="sm"
                        className="rounded-full cursor-pointer shrink-0"
                        onClick={() => onStatusChange(tab.value)}
                    >
                        {tab.label}
                    </Button>
                ))}
            </div>

            {/* Search row */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder={t(
                            translationKeys.hotelBookingListing
                                .searchPlaceholder
                        )}
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 w-full sm:w-56"
                    />
                </div>
                <Button variant="outline" size="sm" className="px-2.5 shrink-0">
                    <SlidersHorizontal className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}

import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKeys from "@/utils/i18n/translationKey";

interface BookingPageHeaderProps {
    hotelName: string | undefined;
}

export default function BookingPageHeader({
    hotelName,
}: BookingPageHeaderProps) {
    const { t } = useTranslation();

    const todayFormatted = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });

    return (
        <div className="flex items-start justify-between mb-8 gap-3">
            <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                    {hotelName || "Dashboard"}
                </h1>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {t(translationKeys.hotelBookingListing.operationsOverview, {
                        hotel: hotelName || "Hotel",
                    })}
                </p>
            </div>
            <Button
                variant="outline"
                size="sm"
                className="gap-2 flex-shrink-0 whitespace-nowrap"
            >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">
                    {t(translationKeys.hotelBookingListing.today, {
                        date: todayFormatted,
                    })}
                </span>
                <span className="sm:hidden">{todayFormatted}</span>
            </Button>
        </div>
    );
}

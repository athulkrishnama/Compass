import { Hotel } from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface EmptyBookingsStateProps {
    type: "upcoming" | "ongoing" | "past";
}

export function EmptyBookingsState({ type }: EmptyBookingsStateProps) {
    const { t } = useTranslation();

    const config = {
        upcoming: {
            title: t(translationKey.bookingHistory.noUpcomingBookings),
            description: t(translationKey.bookingHistory.noUpcomingDescription),
        },
        ongoing: {
            title: t(translationKey.bookingHistory.noOngoingBookings),
            description: t(translationKey.bookingHistory.noOngoingDescription),
        },
        past: {
            title: t(translationKey.bookingHistory.noPastBookings),
            description: t(translationKey.bookingHistory.noPastDescription),
        },
    };

    const currentConfig = config[type];

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-8">
                <Hotel className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <h3 className="text-3xl font-serif text-foreground mb-4 text-center tracking-tight">
                {currentConfig.title}
            </h3>
            <p className="text-muted-foreground text-center max-w-sm leading-relaxed font-medium">
                {currentConfig.description}
            </p>
        </div>
    );
}

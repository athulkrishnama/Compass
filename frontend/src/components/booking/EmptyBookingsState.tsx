import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface EmptyBookingsStateProps {
    type: "upcoming" | "past";
}

export function EmptyBookingsState({ type }: EmptyBookingsStateProps) {
    const { t } = useTranslation();

    const config = {
        upcoming: {
            title: t(translationKey.bookingHistory.noUpcomingBookings),
            description: t(translationKey.bookingHistory.noUpcomingDescription),
        },
        past: {
            title: t(translationKey.bookingHistory.noPastBookings),
            description: t(translationKey.bookingHistory.noPastDescription),
        },
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center"
        >
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
                <Calendar className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
                {config[type].title}
            </h3>
            <p className="text-muted-foreground max-w-md">
                {config[type].description}
            </p>
        </motion.div>
    );
}

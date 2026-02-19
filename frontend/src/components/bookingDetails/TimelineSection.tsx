import { motion } from "framer-motion";
import { Plane } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface TimelineSectionProps {
    checkInDate: string;
    checkOutDate: string;
    checkInTime: string;
    checkOutTime: string;
}

export function TimelineSection({
    checkInDate,
    checkOutDate,
    checkInTime,
    checkOutTime,
}: TimelineSectionProps) {
    const { t } = useTranslation();
    const nights = differenceInDays(
        new Date(checkOutDate),
        new Date(checkInDate)
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-2xl border border-border bg-background p-5 flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-300"
        >
            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-6">
                {t(translationKey.bookingDetails.timeline)}
            </h3>

            <div className="flex items-center gap-3 mb-2">
                <div className="flex-1">
                    <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
                        {t(translationKey.bookingDetails.checkIn)}
                    </p>
                    <p className="text-xl font-bold text-foreground mt-0.5">
                        {format(new Date(checkInDate), "MMM dd")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {format(new Date(checkInDate), "EEE")}, {checkInTime}
                    </p>
                </div>

                <div className="flex items-center gap-1 text-muted-foreground/40 flex-shrink-0 pt-2">
                    <div className="w-6 border-t border-dashed border-muted-foreground/30" />
                    <Plane className="w-4 h-4 text-muted-foreground/50" />
                    <div className="w-6 border-t border-dashed border-muted-foreground/30" />
                </div>

                <div className="flex-1 text-right">
                    <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
                        {t(translationKey.bookingDetails.checkOut)}
                    </p>
                    <p className="text-xl font-bold text-foreground mt-0.5">
                        {format(new Date(checkOutDate), "MMM dd")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {format(new Date(checkOutDate), "EEE")}, {checkOutTime}
                    </p>
                </div>
            </div>

            <div className="mt-auto pt-4">
                <div className="text-center">
                    <span className="inline-block px-4 py-1.5 border border-border rounded-full text-xs font-medium text-foreground">
                        {t(translationKey.bookingDetails.nightsTotal, {
                            count: nights,
                        })}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

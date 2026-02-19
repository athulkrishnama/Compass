import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface GuestInfoBarProps {
    maxOccupancy: number;
}

export function GuestInfoBar({ maxOccupancy }: GuestInfoBarProps) {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="rounded-2xl border border-border bg-background px-6 py-4 shadow-md"
        >
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                    <Users className="w-4 h-4 text-foreground" />
                </div>
                <div>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                        {t(translationKey.bookingDetails.totalGuests)}
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                        {t(translationKey.bookingDetails.adults, {
                            count: maxOccupancy,
                        })}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

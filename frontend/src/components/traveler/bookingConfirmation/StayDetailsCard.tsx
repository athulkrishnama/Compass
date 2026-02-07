import { motion } from "framer-motion";
import { CalendarDays, Moon } from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface StayDetailsCardProps {
    checkInDate: Date;
    checkOutDate: Date;
    nights: number;
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1] as const,
        },
    },
};

export default function StayDetailsCard({
    checkInDate,
    checkOutDate,
    nights,
}: StayDetailsCardProps) {
    const { t } = useTranslation();
    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <motion.div variants={itemVariants}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
                {t(translationKey.bookingConfirmation.stayDetails)}
            </h2>
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <CalendarDays className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wide">
                            {t(translationKey.bookingConfirmation.checkIn)}
                        </span>
                    </div>
                    <p className="text-base font-bold text-gray-900">
                        {formatDate(checkInDate)}
                    </p>
                    <p className="text-sm text-gray-500">
                        {t(translationKey.bookingConfirmation.from, {
                            time: "2:00 PM",
                        })}
                    </p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <CalendarDays className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wide">
                            {t(translationKey.bookingConfirmation.checkOut)}
                        </span>
                    </div>
                    <p className="text-base font-bold text-gray-900">
                        {formatDate(checkOutDate)}
                    </p>
                    <p className="text-sm text-gray-500">
                        {t(translationKey.bookingConfirmation.until, {
                            time: "11:00 AM",
                        })}
                    </p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <Moon className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wide">
                            {t(
                                translationKey.bookingConfirmation.totalDuration
                            )}
                        </span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">
                        {nights} {t(translationKey.bookingConfirmation.nights)}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

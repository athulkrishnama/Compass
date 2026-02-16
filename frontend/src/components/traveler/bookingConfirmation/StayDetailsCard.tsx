import { motion } from "framer-motion";
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
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500">
                            {t(translationKey.bookingConfirmation.checkIn)}:
                        </span>
                        <span className="font-semibold text-gray-900">
                            {formatDate(checkInDate)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500">
                            {t(translationKey.bookingConfirmation.checkOut)}:
                        </span>
                        <span className="font-semibold text-gray-900">
                            {formatDate(checkOutDate)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500">
                            {t(
                                translationKey.bookingConfirmation.totalDuration
                            )}
                            :
                        </span>
                        <span className="font-semibold text-gray-900">
                            {nights}{" "}
                            {t(translationKey.bookingConfirmation.nights)}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

import { motion } from "framer-motion";
import { BookingStatus } from "@/enums/bookingStatus";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface BookingHeaderProps {
    bookingStatus: BookingStatus;
    createdAt: string;
    id: string;
}

const statusStyles: Record<BookingStatus, string> = {
    [BookingStatus.CONFIRMED]: "bg-black text-white",
    [BookingStatus.CHECKED_IN]: "bg-blue-600 text-white",
    [BookingStatus.CANCELLED]: "bg-red-600 text-white",
    [BookingStatus.COMPLETED]: "bg-gray-600 text-white",
};

export function BookingHeader({
    bookingStatus,
    createdAt,
}: BookingHeaderProps) {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${statusStyles[bookingStatus] || statusStyles.CONFIRMED}`}
                        >
                            {t(translationKey.bookingStatus[bookingStatus])}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {format(new Date(createdAt), "MMMM dd, yyyy")}
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                        {t(translationKey.bookingDetails.title)}
                    </h1>
                </div>
            </div>
        </motion.div>
    );
}

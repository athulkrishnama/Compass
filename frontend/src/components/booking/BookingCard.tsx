import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import { BookingStatus } from "@/enums/bookingStatus";
import { format } from "date-fns";
import { Link } from "@tanstack/react-router";

interface BookingCardProps {
    id: string;
    hotelName: string;
    coverImage: string;
    city: string;
    checkInDate: string;
    checkOutDate: string;
    totalAmount: number;
    status: BookingStatus;
}

const statusConfig = {
    [BookingStatus.CONFIRMED]: {
        translationKey: translationKey.bookingStatus.CONFIRMED,
        className: "bg-black text-white",
    },
    [BookingStatus.CHECKED_IN]: {
        translationKey: translationKey.bookingStatus.CHECKED_IN,
        className: "bg-blue-600 text-white",
    },
    [BookingStatus.CANCELLED]: {
        translationKey: translationKey.bookingStatus.CANCELLED,
        className: "bg-red-600 text-white",
    },
    [BookingStatus.COMPLETED]: {
        translationKey: translationKey.bookingStatus.COMPLETED,
        className: "bg-gray-200 text-gray-600",
    },
};

export function BookingCard({
    id,
    hotelName,
    coverImage,
    city,
    checkInDate,
    checkOutDate,
    totalAmount,
    status,
}: BookingCardProps) {
    const { t } = useTranslation();

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "MMM dd, yyyy");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="group"
        >
            <div className="flex flex-col h-full border border-border/40 rounded-[1.5rem] overflow-hidden bg-background shadow-[0_10px_100px_-20px_rgba(0,0,0,0.5)] hover:shadow-[0_10px_100px_-25px_rgba(0,0,0,0.4)] hover:-translate-y-2 transition-all duration-500">
                <div className="relative aspect-video overflow-hidden">
                    <img
                        src={coverImage}
                        alt={hotelName}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3">
                        <span
                            className={`px-2.5 py-1 rounded-full text-[9px] font-bold tracking-tighter uppercase ${statusConfig[status].className}`}
                        >
                            {t(statusConfig[status].translationKey)}
                        </span>
                    </div>
                </div>

                <div className="flex-1 p-5 flex flex-col">
                    <div className="mb-4">
                        <h3 className="font-serif text-xl text-foreground mb-0.5 group-hover:text-primary transition-colors line-clamp-1">
                            {hotelName}
                        </h3>
                        <div className="flex items-center text-muted-foreground/80">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span className="text-xs font-medium tracking-tight line-clamp-1">
                                {city}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-5 pt-4 border-t border-border/40">
                        <div className="flex flex-col text-xs">
                            <span className="text-muted-foreground font-medium mb-0.5">
                                {t(translationKey.bookingConfirmation.checkIn)}
                            </span>
                            <span className="font-bold text-foreground">
                                {formatDate(checkInDate)}
                            </span>
                        </div>
                        <div className="flex flex-col text-xs border-l border-border/40 pl-3">
                            <span className="text-muted-foreground font-medium mb-0.5">
                                {t(translationKey.bookingConfirmation.checkOut)}
                            </span>
                            <span className="font-bold text-foreground">
                                {formatDate(checkOutDate)}
                            </span>
                        </div>
                    </div>

                    <div className="mt-auto pt-3 flex items-center justify-between">
                        <div>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">
                                {t(translationKey.bookingHistory.total)}
                            </p>
                            <p className="text-lg text-foreground leading-none">
                                ₹{totalAmount.toLocaleString("en-IN")}
                            </p>
                        </div>

                        <Link
                            to="/traveler/booking/$bookingId"
                            params={{ bookingId: id }}
                            className="px-5 py-2 border border-border hover:bg-muted text-xs font-bold rounded-full transition-all active:scale-95"
                        >
                            {status === BookingStatus.COMPLETED
                                ? t(translationKey.bookingHistory.viewReceipt)
                                : t(translationKey.bookingHistory.viewDetails)}
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

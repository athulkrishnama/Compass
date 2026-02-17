import { MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import { BOOKING_STATUS } from "@/types/api/responses/bookingResponse";
import { format } from "date-fns";

interface BookingCardProps {
    id: string;
    hotelName: string;
    coverImage: string;
    city: string;
    checkInDate: string;
    checkOutDate: string;
    totalAmount: number;
    status: BOOKING_STATUS;
}

const statusConfig = {
    [BOOKING_STATUS.CONFIRMED]: {
        className: "text-green-600",
    },
    [BOOKING_STATUS.CHECKED_IN]: {
        className: "text-blue-600",
    },
    [BOOKING_STATUS.CANCELLED]: {
        className: "text-red-600",
    },
    [BOOKING_STATUS.COMPLETED]: {
        className: "text-gray-500",
    },
};

export function BookingCard({
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

    const calculateNights = () => {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const nights = calculateNights();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="border border-border rounded-2xl overflow-hidden bg-background hover:shadow-md transition-shadow duration-300">
                <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-[200px] h-48 sm:h-auto sm:min-h-[180px] flex-shrink-0 overflow-hidden">
                        <img
                            src={coverImage}
                            alt={hotelName}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex-1 p-5 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <span
                                    className={`text-[10px] font-bold tracking-widest uppercase ${statusConfig[status].className}`}
                                >
                                    {t(translationKey.bookingStatus[status])}
                                </span>
                                <h3 className="text-lg font-semibold text-foreground mt-0.5">
                                    {hotelName}
                                </h3>
                                <div className="flex items-center text-muted-foreground mt-1">
                                    <MapPin className="w-3.5 h-3.5 mr-1" />
                                    <span className="text-sm">{city}</span>
                                </div>
                            </div>

                            <div className="text-right flex-shrink-0 ml-4">
                                <p className="text-lg font-semibold text-foreground">
                                    ₹
                                    {totalAmount.toLocaleString("en-IN", {
                                        minimumFractionDigits: 2,
                                    })}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {t(
                                        translationKey.bookingConfirmation
                                            .totalAmount
                                    )}{" "}
                                    {nights}{" "}
                                    {t(
                                        translationKey.bookingConfirmation
                                            .nights
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-6">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span>
                                    {formatDate(checkInDate)} -{" "}
                                    {formatDate(checkOutDate)}
                                </span>
                            </div>

                            <button className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-border rounded-full hover:bg-muted transition-colors">
                                {status === BOOKING_STATUS.COMPLETED ? (
                                    <>
                                        {t(
                                            translationKey.bookingHistory
                                                .viewReceipt
                                        )}
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </>
                                ) : (
                                    t(translationKey.bookingHistory.viewDetails)
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

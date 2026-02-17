import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
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
        variant: "default" as const,
        className: "bg-blue-500/10 text-blue-700 border-blue-200",
    },
    [BOOKING_STATUS.CHECKED_IN]: {
        variant: "default" as const,
        className: "bg-green-500/10 text-green-700 border-green-200",
    },
    [BOOKING_STATUS.CANCELLED]: {
        variant: "destructive" as const,
        className: "bg-red-500/10 text-red-700 border-red-200",
    },
    [BOOKING_STATUS.COMPLETED]: {
        variant: "secondary" as const,
        className: "bg-gray-500/10 text-gray-700 border-gray-200",
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
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-64 h-48 md:h-auto relative overflow-hidden">
                        <img
                            src={coverImage}
                            alt={hotelName}
                            className="w-full h-full object-cover"
                        />
                        <Badge
                            className={`absolute top-3 left-3 ${statusConfig[status].className}`}
                        >
                            {t(translationKey.bookingStatus[status])}
                        </Badge>
                    </div>

                    <div className="flex-1 p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="text-xl font-semibold text-foreground">
                                            {hotelName}
                                        </h3>
                                        <div className="flex items-center text-muted-foreground mt-1">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            <span className="text-sm">
                                                {city}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 mt-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground text-xs mb-1">
                                            {t(
                                                translationKey
                                                    .bookingConfirmation.checkIn
                                            )}
                                        </p>
                                        <div className="flex items-center font-medium">
                                            <Calendar className="w-4 h-4 mr-1.5 text-muted-foreground" />
                                            {formatDate(checkInDate)}
                                        </div>
                                    </div>
                                    <div className="text-muted-foreground">
                                        →
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-xs mb-1">
                                            {t(
                                                translationKey
                                                    .bookingConfirmation
                                                    .checkOut
                                            )}
                                        </p>
                                        <div className="flex items-center font-medium">
                                            <Calendar className="w-4 h-4 mr-1.5 text-muted-foreground" />
                                            {formatDate(checkOutDate)}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 text-sm text-muted-foreground">
                                    {calculateNights()}{" "}
                                    {t(
                                        translationKey.bookingConfirmation
                                            .nights
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-3">
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-foreground">
                                        ₹{totalAmount.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {t(
                                            translationKey.bookingConfirmation
                                                .totalAmount
                                        )}
                                    </p>
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full md:w-auto"
                                >
                                    {status === BOOKING_STATUS.COMPLETED
                                        ? t(
                                              translationKey.bookingHistory
                                                  .viewReceipt
                                          )
                                        : t(
                                              translationKey.bookingHistory
                                                  .viewDetails
                                          )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

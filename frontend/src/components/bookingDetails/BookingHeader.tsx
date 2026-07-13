import { motion } from "framer-motion";
import { BookingStatus } from "@/enums/bookingStatus";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

import { Badge } from "@/components/ui/badge";

interface BookingHeaderProps {
    bookingStatus: BookingStatus;
    createdAt: string;
    id: string;
    roomNumbers?: number[];
    numberOfRooms?: number;
    isWalkIn?: boolean;
    bookingId?: string;
}

export function BookingHeader({
    bookingStatus,
    createdAt,
    roomNumbers,
    numberOfRooms,
    isWalkIn,
    bookingId,
}: BookingHeaderProps) {
    const { t } = useTranslation();

    const getStatusBadge = () => {
        switch (bookingStatus) {
            case BookingStatus.CANCELLED:
                return (
                    <Badge
                        variant="destructive"
                        className="text-[10px] font-bold tracking-widest uppercase px-3 py-1"
                    >
                        {t(translationKey.bookingStatus[bookingStatus])}
                    </Badge>
                );
            case BookingStatus.COMPLETED:
                return (
                    <Badge
                        variant="secondary"
                        className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 bg-zinc-200 text-zinc-900 hover:bg-zinc-200"
                    >
                        {t(translationKey.bookingStatus[bookingStatus])}
                    </Badge>
                );
            default:
                return (
                    <Badge className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 bg-black text-white hover:bg-black">
                        {t(translationKey.bookingStatus[bookingStatus])}
                    </Badge>
                );
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                        {getStatusBadge()}

                        {bookingStatus === BookingStatus.CHECKED_IN &&
                            roomNumbers &&
                            roomNumbers.length > 0 && (
                                <Badge
                                    variant="outline"
                                    className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 border-zinc-200 text-zinc-600 font-mono"
                                >
                                    {t(
                                        translationKey.bookingDetails.roomNumber
                                    )}
                                    : {roomNumbers.join(", ")}
                                </Badge>
                            )}

                        {bookingStatus !== BookingStatus.CHECKED_IN &&
                            bookingStatus !== BookingStatus.COMPLETED &&
                            numberOfRooms && (
                                <Badge
                                    variant="outline"
                                    className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 border-zinc-200 text-zinc-600 font-mono"
                                >
                                    {numberOfRooms}{" "}
                                    {numberOfRooms > 1 ? "Rooms" : "Room"}{" "}
                                    (Unassigned)
                                </Badge>
                            )}

                        {isWalkIn && (
                            <Badge className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-900">
                                {t(translationKey.bookingDetails.walkIn)}
                            </Badge>
                        )}

                        <span className="text-sm text-muted-foreground font-medium">
                            {format(new Date(createdAt), "MMMM dd, yyyy")}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                            {t(translationKey.bookingDetails.title)}
                        </h1>
                        {bookingId && (
                            <p className="text-sm font-mono text-muted-foreground mt-2">
                                Booking ID: {bookingId}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

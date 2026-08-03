import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import translationKeys from "@/utils/i18n/translationKey";
import type { IHotelBookingListingItem } from "@/types/api/responses/bookingResponse";
import { BookingStatus } from "@/enums/bookingStatus";
import { PaymentStatus } from "@/enums/paymentStatus";

const statusStyles: Record<BookingStatus, string> = {
    [BookingStatus.CONFIRMED]: "bg-blue-50 text-blue-700 border-blue-200",
    [BookingStatus.CHECKED_IN]: "bg-green-50 text-green-700 border-green-200",
    [BookingStatus.COMPLETED]: "bg-gray-100 text-gray-700 border-gray-200",
    [BookingStatus.CANCELLED]: "bg-red-50 text-red-700 border-red-200",
};

const paymentColors: Record<PaymentStatus, string> = {
    [PaymentStatus.PAID]: "text-green-600",
    [PaymentStatus.SUCCESS]: "text-green-600",
    [PaymentStatus.PENDING]: "text-amber-600",
    [PaymentStatus.REFUNDED]: "text-purple-600",
    [PaymentStatus.FAILED]: "text-red-600",
};

const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.05, duration: 0.3 },
    }),
    exit: { opacity: 0, transition: { duration: 0.15 } },
};

function formatBookingId(id: string): string {
    return `#BK-${id.slice(-3).toUpperCase()}`;
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function formatStatus(status: string): string {
    return status
        .replace("_", " ")
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
}

interface BookingCardMobileProps {
    booking: IHotelBookingListingItem;
    index: number;
    onCheckIn: (booking: IHotelBookingListingItem) => void;
    onCheckOut: (booking: IHotelBookingListingItem) => void;
}

export default function BookingCardMobile({
    booking,
    index,
    onCheckIn,
    onCheckOut,
}: BookingCardMobileProps) {
    const { t } = useTranslation();

    return (
        <motion.div
            key={booking.id}
            custom={index}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={cardVariants}
            className="bg-card rounded-xl border border-border p-4 flex flex-col gap-3 shadow-sm"
        >
            {/* Top row: avatar + name + booking ID */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarImage
                            src={booking.travelerProfileImage}
                            alt={booking.guestName}
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-muted text-xs font-semibold text-muted-foreground">
                            {booking.guestName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate text-sm">
                            {booking.guestName}
                        </p>
                        <p className="text-xs font-mono text-muted-foreground">
                            {booking.bookingId || formatBookingId(booking.id)}
                        </p>
                    </div>
                </div>
                <Badge
                    variant="outline"
                    className={`flex-shrink-0 text-xs ${statusStyles[booking.bookingStatus] || "bg-muted text-muted-foreground"}`}
                >
                    {formatStatus(booking.bookingStatus)}
                </Badge>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                    <p className="text-xs text-muted-foreground mb-0.5">
                        {t(translationKeys.hotelBookingListing.variant)}
                    </p>
                    <p className="font-medium text-foreground truncate">
                        {booking.roomVariantName}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground mb-0.5">
                        {t(translationKeys.hotelBookingListing.room)}
                    </p>
                    <p className="font-medium text-foreground">
                        {booking.roomNumbers?.join(", ") || "-"}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground mb-0.5">
                        {t(translationKeys.hotelBookingListing.checkIn)}
                    </p>
                    <p className="font-medium text-foreground">
                        {formatDate(booking.checkInDate)}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground mb-0.5">
                        {t(translationKeys.hotelBookingListing.checkOut)}
                    </p>
                    <p className="font-medium text-foreground">
                        {formatDate(booking.checkOutDate)}
                    </p>
                </div>
            </div>

            {/* Bottom row: amount + payment + action button */}
            <div className="flex items-center justify-between pt-1 border-t border-border/50 gap-2">
                <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                        {t(translationKeys.hotelBookingListing.amount)}
                    </p>
                    <p className="font-semibold text-foreground text-sm">
                        ₹{booking.totalAmount.toLocaleString("en-IN")}
                    </p>
                    <span
                        className={`text-xs font-medium ${paymentColors[booking.paymentStatus] || "text-muted-foreground"}`}
                    >
                        {formatStatus(booking.paymentStatus)}
                    </span>
                </div>

                <div className="flex-shrink-0">
                    {booking.bookingStatus === BookingStatus.CONFIRMED && (
                        <Button
                            variant="default"
                            size="sm"
                            className="h-8 text-xs bg-black hover:bg-black/90 text-white"
                            onClick={() => onCheckIn(booking)}
                            disabled={
                                new Date() < new Date(booking.checkInDate) ||
                                new Date() > new Date(booking.checkOutDate)
                            }
                        >
                            {t(translationKeys.hotelBookingListing.checkIn)}
                        </Button>
                    )}
                    {booking.bookingStatus === BookingStatus.CHECKED_IN && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs border-black text-black hover:bg-gray-100"
                            onClick={() => onCheckOut(booking)}
                        >
                            {t(translationKeys.hotelBookingListing.checkOut)}
                        </Button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

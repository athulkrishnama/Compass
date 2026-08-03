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

const rowVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.05, duration: 0.3 },
    }),
    exit: { opacity: 0, transition: { duration: 0.2 } },
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

interface BookingTableDesktopProps {
    bookings: IHotelBookingListingItem[];
    onCheckIn: (booking: IHotelBookingListingItem) => void;
    onCheckOut: (booking: IHotelBookingListingItem) => void;
}

export default function BookingTableDesktop({
    bookings,
    onCheckIn,
    onCheckOut,
}: BookingTableDesktopProps) {
    const { t } = useTranslation();

    return (
        <div className="bg-card rounded-xl border overflow-hidden">
            <div className="overflow-x-auto hide-scroll-bar">
                <table className="w-full text-sm table-fixed min-w-[900px]">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-[7%]">
                                {t(translationKeys.hotelBookingListing.id)}
                            </th>
                            <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-[14%]">
                                {t(
                                    translationKeys.hotelBookingListing
                                        .guestName
                                )}
                            </th>
                            <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-[11%]">
                                {t(translationKeys.hotelBookingListing.variant)}
                            </th>
                            <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-[6%]">
                                {t(translationKeys.hotelBookingListing.room)}
                            </th>
                            <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-[10%]">
                                {t(translationKeys.hotelBookingListing.checkIn)}
                            </th>
                            <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-[10%]">
                                {t(
                                    translationKeys.hotelBookingListing.checkOut
                                )}
                            </th>
                            <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-[9%]">
                                {t(translationKeys.hotelBookingListing.amount)}
                            </th>
                            <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-[9%]">
                                {t(translationKeys.hotelBookingListing.payment)}
                            </th>
                            <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-[9%]">
                                {t(translationKeys.hotelBookingListing.status)}
                            </th>
                            <th className="px-3 py-3.5 w-[15%]"></th>
                        </tr>
                    </thead>
                    <tbody className="min-h-[320px]">
                        {bookings.length > 0 ? (
                            bookings.map(
                                (
                                    booking: IHotelBookingListingItem,
                                    index: number
                                ) => (
                                    <motion.tr
                                        key={booking.id}
                                        custom={index}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        variants={rowVariants}
                                        className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                                    >
                                        <td className="px-5 py-4 text-muted-foreground text-xs font-mono">
                                            {booking.bookingId ||
                                                formatBookingId(booking.id)}
                                        </td>
                                        <td className="px-5 py-4 overflow-hidden">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <Avatar className="w-8 h-8 flex-shrink-0">
                                                    <AvatarImage
                                                        src={
                                                            booking.travelerProfileImage
                                                        }
                                                        alt={booking.guestName}
                                                        className="object-cover"
                                                    />
                                                    <AvatarFallback className="bg-muted text-xs font-semibold text-muted-foreground">
                                                        {booking.guestName
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium text-foreground truncate">
                                                    {booking.guestName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-muted-foreground truncate">
                                            {booking.roomVariantName}
                                        </td>
                                        <td className="px-5 py-4 text-foreground font-medium text-center">
                                            {booking.roomNumbers?.join(", ") ||
                                                "-"}
                                        </td>
                                        <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">
                                            {formatDate(booking.checkInDate)}
                                        </td>
                                        <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">
                                            {formatDate(booking.checkOutDate)}
                                        </td>
                                        <td className="px-5 py-4 font-semibold text-foreground">
                                            ₹
                                            {booking.totalAmount.toLocaleString(
                                                "en-IN"
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`text-sm font-medium ${paymentColors[booking.paymentStatus] || "text-muted-foreground"}`}
                                            >
                                                {formatStatus(
                                                    booking.paymentStatus
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <Badge
                                                variant="outline"
                                                className={
                                                    statusStyles[
                                                        booking.bookingStatus
                                                    ] ||
                                                    "bg-muted text-muted-foreground"
                                                }
                                            >
                                                {formatStatus(
                                                    booking.bookingStatus
                                                )}
                                            </Badge>
                                        </td>
                                        <td className="px-5 py-4">
                                            {booking.bookingStatus ===
                                                BookingStatus.CONFIRMED && (
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    className="h-8 text-xs bg-black hover:bg-black/90 text-white"
                                                    onClick={() =>
                                                        onCheckIn(booking)
                                                    }
                                                    disabled={
                                                        new Date() <
                                                            new Date(
                                                                booking.checkInDate
                                                            ) ||
                                                        new Date() >
                                                            new Date(
                                                                booking.checkOutDate
                                                            )
                                                    }
                                                >
                                                    {t(
                                                        translationKeys
                                                            .hotelBookingListing
                                                            .checkIn
                                                    )}
                                                </Button>
                                            )}
                                            {booking.bookingStatus ===
                                                BookingStatus.CHECKED_IN && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 text-xs border-black text-black hover:bg-gray-100"
                                                    onClick={() =>
                                                        onCheckOut(booking)
                                                    }
                                                >
                                                    {t(
                                                        translationKeys
                                                            .hotelBookingListing
                                                            .checkOut
                                                    )}
                                                </Button>
                                            )}
                                        </td>
                                    </motion.tr>
                                )
                            )
                        ) : (
                            <tr>
                                <td
                                    colSpan={10}
                                    className="text-center py-12 text-muted-foreground"
                                >
                                    {t(
                                        translationKeys.hotelBookingListing
                                            .noBookingsFound
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

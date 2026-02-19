import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { createGetHotelBookingsQueryOptions } from "@/queryOptions/bookingQueryOptions";
import { createGetRoomVariantByHotelIdQueryOptions } from "@/queryOptions/roomVariantQueryOptions";
import { createGetHotelByIdQueryOptions } from "@/queryOptions/hotelQueryOptions";
import RoomVariantSelector from "@/components/hotel/bookings/RoomVariantSelector";
import Pagination from "@/components/shared/Pagination/Pagination";
import Loading from "@/components/shared/loading/Loading";
import type { IHotelBookingListingItem } from "@/types/api/responses/bookingResponse";
import { BookingStatus } from "@/enums/bookingStatus";
import { PaymentStatus } from "@/enums/paymentStatus";
import { useTranslation } from "react-i18next";
import translationKeys from "@/utils/i18n/translationKey";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Search, SlidersHorizontal } from "lucide-react";
import CheckInModal from "@/components/hotel/bookings/CheckInModal";
import CheckOutModal from "@/components/hotel/bookings/CheckOutModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

export default function HotelBookingDetails() {
    const { hotelId } = useParams({ from: "/hotel/bookings/$hotelId" });
    const { t } = useTranslation();
    const [selectedVariantId, setSelectedVariantId] = useState<
        string | undefined
    >(undefined);
    const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
        undefined
    );
    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebouncedValue(search, { wait: 500 });
    const [pageNo, setPageNo] = useState(1);
    const [selectedBooking, setSelectedBooking] =
        useState<IHotelBookingListingItem | null>(null);
    const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
    const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);

    const handleCheckInClick = (booking: IHotelBookingListingItem) => {
        setSelectedBooking(booking);
        setIsCheckInModalOpen(true);
    };

    const handleCheckOutClick = (booking: IHotelBookingListingItem) => {
        setSelectedBooking(booking);
        setIsCheckOutModalOpen(true);
    };

    const STATUS_TABS = [
        {
            label: t(translationKeys.hotelBookingListing.current),
            value: BookingStatus.CHECKED_IN,
        },
        {
            label: t(translationKeys.hotelBookingListing.upcoming),
            value: BookingStatus.CONFIRMED,
        },
        {
            label: t(translationKeys.hotelBookingListing.past),
            value: BookingStatus.COMPLETED,
        },
        {
            label: t(translationKeys.hotelBookingListing.cancelled),
            value: BookingStatus.CANCELLED,
        },
        {
            label: t(translationKeys.hotelBookingListing.all),
            value: undefined,
        },
    ];

    const { data: hotelData } = useQuery(
        createGetHotelByIdQueryOptions(hotelId)
    );

    const { data: roomVariantsData } = useQuery(
        createGetRoomVariantByHotelIdQueryOptions(hotelId)
    );

    const { data: bookingsData, isLoading: bookingsLoading } = useQuery(
        createGetHotelBookingsQueryOptions(hotelId, {
            pageNo,
            roomVariantId: selectedVariantId,
            status: selectedStatus,
            search: debouncedSearch || undefined,
        })
    );

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPageNo(1);
    };

    const handleVariantSelect = (variantId: string | undefined) => {
        setSelectedVariantId(variantId);
        setPageNo(1);
    };

    const handleStatusChange = (status: string | undefined) => {
        setSelectedStatus(status);
        setPageNo(1);
    };

    const hotel = hotelData?.data;
    const roomVariants = roomVariantsData?.data?.roomVariants || [];
    const bookings = bookingsData?.data?.bookings || [];
    const totalPages = bookingsData?.data?.totalPages || 0;
    const currentPage = bookingsData?.data?.currentPage || 1;

    const todayFormatted = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        {hotel?.name || "Dashboard"}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {t(
                            translationKeys.hotelBookingListing
                                .operationsOverview,
                            {
                                hotel: hotel?.name || "Hotel",
                            }
                        )}
                    </p>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                    <Calendar className="w-4 h-4" />
                    {t(translationKeys.hotelBookingListing.today, {
                        date: todayFormatted,
                    })}
                </Button>
            </div>

            <div className="mb-8">
                <RoomVariantSelector
                    roomVariants={roomVariants}
                    selectedVariantId={selectedVariantId}
                    onSelect={handleVariantSelect}
                />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex gap-2 overflow-x-auto hide-scroll-bar">
                    {STATUS_TABS.map((tab) => (
                        <Button
                            key={tab.label}
                            variant={
                                selectedStatus === tab.value
                                    ? "default"
                                    : "outline"
                            }
                            size="sm"
                            className="rounded-full cursor-pointer"
                            onClick={() => handleStatusChange(tab.value)}
                        >
                            {tab.label}
                        </Button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder={t(
                                translationKeys.hotelBookingListing
                                    .searchPlaceholder
                            )}
                            value={search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="pl-10 w-56"
                        />
                    </div>
                    <Button variant="outline" size="sm" className="px-2.5">
                        <SlidersHorizontal className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {bookingsLoading ? (
                <Loading />
            ) : (
                <>
                    <div className="bg-card rounded-xl border overflow-hidden">
                        <div className="overflow-x-auto hide-scroll-bar">
                            <table className="w-full text-sm table-fixed min-w-[900px]">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-[7%]">
                                            {t(
                                                translationKeys
                                                    .hotelBookingListing.id
                                            )}
                                        </th>
                                        <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-[14%]">
                                            {t(
                                                translationKeys
                                                    .hotelBookingListing
                                                    .guestName
                                            )}
                                        </th>
                                        <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-[11%]">
                                            {t(
                                                translationKeys
                                                    .hotelBookingListing.variant
                                            )}
                                        </th>
                                        <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-[6%]">
                                            {t(
                                                translationKeys
                                                    .hotelBookingListing.room
                                            )}
                                        </th>
                                        <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-[10%]">
                                            {t(
                                                translationKeys
                                                    .hotelBookingListing.checkIn
                                            )}
                                        </th>
                                        <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-[10%]">
                                            {t(
                                                translationKeys
                                                    .hotelBookingListing
                                                    .checkOut
                                            )}
                                        </th>
                                        <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-[9%]">
                                            {t(
                                                translationKeys
                                                    .hotelBookingListing.amount
                                            )}
                                        </th>
                                        <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-[9%]">
                                            {t(
                                                translationKeys
                                                    .hotelBookingListing.payment
                                            )}
                                        </th>
                                        <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-[9%]">
                                            {t(
                                                translationKeys
                                                    .hotelBookingListing.status
                                            )}
                                        </th>
                                        <th className="px-3 py-3.5 w-[15%]"></th>
                                    </tr>
                                </thead>
                                <tbody className="min-h-[320px]">
                                    <AnimatePresence mode="wait">
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
                                                            {formatBookingId(
                                                                booking.id
                                                            )}
                                                        </td>
                                                        <td className="px-5 py-4 overflow-hidden">
                                                            <div className="flex items-center gap-3 min-w-0">
                                                                <Avatar className="w-8 h-8 flex-shrink-0">
                                                                    <AvatarImage
                                                                        src={
                                                                            booking.travelerProfileImage
                                                                        }
                                                                        alt={
                                                                            booking.guestName
                                                                        }
                                                                        className="object-cover"
                                                                    />
                                                                    <AvatarFallback className="bg-muted text-xs font-semibold text-muted-foreground">
                                                                        {booking.guestName
                                                                            .charAt(
                                                                                0
                                                                            )
                                                                            .toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <span className="font-medium text-foreground truncate">
                                                                    {
                                                                        booking.guestName
                                                                    }
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-4 text-muted-foreground truncate">
                                                            {
                                                                booking.roomVariantName
                                                            }
                                                        </td>
                                                        <td className="px-5 py-4 text-foreground font-medium text-center">
                                                            {booking.roomNumber}
                                                        </td>
                                                        <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">
                                                            {formatDate(
                                                                booking.checkInDate
                                                            )}
                                                        </td>
                                                        <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">
                                                            {formatDate(
                                                                booking.checkOutDate
                                                            )}
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
                                                                        booking
                                                                            .bookingStatus
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
                                                                        handleCheckInClick(
                                                                            booking
                                                                        )
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
                                                                        handleCheckOutClick(
                                                                            booking
                                                                        )
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
                                                        translationKeys
                                                            .hotelBookingListing
                                                            .noBookingsFound
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {totalPages > 1 && (
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            setPage={setPageNo}
                        />
                    )}
                </>
            )}
            {selectedBooking && hotelId && (
                <>
                    <CheckInModal
                        isOpen={isCheckInModalOpen}
                        onClose={() => setIsCheckInModalOpen(false)}
                        booking={selectedBooking}
                        hotelId={hotelId}
                    />
                    <CheckOutModal
                        isOpen={isCheckOutModalOpen}
                        onClose={() => setIsCheckOutModalOpen(false)}
                        booking={selectedBooking}
                        hotelId={hotelId}
                    />
                </>
            )}
        </div>
    );
}

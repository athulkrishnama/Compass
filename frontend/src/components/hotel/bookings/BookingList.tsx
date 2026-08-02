import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import translationKeys from "@/utils/i18n/translationKey";
import type { IHotelBookingListingItem } from "@/types/api/responses/bookingResponse";
import BookingTableDesktop from "@/components/hotel/bookings/BookingTableDesktop";
import BookingCardMobile from "@/components/hotel/bookings/BookingCardMobile";
import Pagination from "@/components/shared/Pagination/Pagination";

interface BookingListProps {
    bookings: IHotelBookingListingItem[];
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    onCheckIn: (booking: IHotelBookingListingItem) => void;
    onCheckOut: (booking: IHotelBookingListingItem) => void;
}

export default function BookingList({
    bookings,
    totalPages,
    currentPage,
    onPageChange,
    onCheckIn,
    onCheckOut,
}: BookingListProps) {
    const { t } = useTranslation();

    return (
        <>
            {/* Desktop: table view (hidden on mobile) */}
            <div className="hidden md:block">
                <AnimatePresence mode="wait">
                    <BookingTableDesktop
                        bookings={bookings}
                        onCheckIn={onCheckIn}
                        onCheckOut={onCheckOut}
                    />
                </AnimatePresence>
            </div>

            {/* Mobile: card view (hidden on md+) */}
            <div className="md:hidden flex flex-col gap-3">
                <AnimatePresence mode="wait">
                    {bookings.length > 0 ? (
                        bookings.map((booking, index) => (
                            <BookingCardMobile
                                key={booking.id}
                                booking={booking}
                                index={index}
                                onCheckIn={onCheckIn}
                                onCheckOut={onCheckOut}
                            />
                        ))
                    ) : (
                        <p className="text-center py-12 text-muted-foreground text-sm">
                            {t(
                                translationKeys.hotelBookingListing
                                    .noBookingsFound
                            )}
                        </p>
                    )}
                </AnimatePresence>
            </div>

            {totalPages > 1 && (
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setPage={onPageChange}
                />
            )}
        </>
    );
}

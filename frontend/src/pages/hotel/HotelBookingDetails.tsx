import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { createGetHotelBookingsQueryOptions } from "@/queryOptions/bookingQueryOptions";
import { createGetRoomVariantByHotelIdQueryOptions } from "@/queryOptions/roomVariantQueryOptions";
import { createGetHotelByIdQueryOptions } from "@/queryOptions/hotelQueryOptions";
import RoomVariantSelector from "@/components/hotel/bookings/RoomVariantSelector";
import Loading from "@/components/shared/loading/Loading";
import type { IHotelBookingListingItem } from "@/types/api/responses/bookingResponse";
import { BookingStatus } from "@/enums/bookingStatus";
import { useTranslation } from "react-i18next";
import translationKeys from "@/utils/i18n/translationKey";
import { useDebouncedValue } from "@tanstack/react-pacer";
import CheckInModal from "@/components/hotel/bookings/CheckInModal";
import CheckOutModal from "@/components/hotel/bookings/CheckOutModal";
import BookingPageHeader from "@/components/hotel/bookings/BookingPageHeader";
import BookingFiltersBar from "@/components/hotel/bookings/BookingFiltersBar";
import BookingList from "@/components/hotel/bookings/BookingList";

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
        { label: t(translationKeys.hotelBookingListing.all), value: undefined },
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

    const handleCheckInClick = (booking: IHotelBookingListingItem) => {
        setSelectedBooking(booking);
        setIsCheckInModalOpen(true);
    };

    const handleCheckOutClick = (booking: IHotelBookingListingItem) => {
        setSelectedBooking(booking);
        setIsCheckOutModalOpen(true);
    };

    const hotel = hotelData?.data;
    const roomVariants = roomVariantsData?.data?.roomVariants || [];
    const bookings = bookingsData?.data?.bookings || [];
    const totalPages = bookingsData?.data?.totalPages || 0;
    const currentPage = bookingsData?.data?.currentPage || 1;

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <BookingPageHeader hotelName={hotel?.name} />

            <div className="mb-6">
                <RoomVariantSelector
                    roomVariants={roomVariants}
                    selectedVariantId={selectedVariantId}
                    onSelect={handleVariantSelect}
                />
            </div>

            <BookingFiltersBar
                statusTabs={STATUS_TABS}
                selectedStatus={selectedStatus}
                onStatusChange={handleStatusChange}
                search={search}
                onSearchChange={handleSearchChange}
            />

            {bookingsLoading ? (
                <Loading />
            ) : (
                <BookingList
                    bookings={bookings}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={setPageNo}
                    onCheckIn={handleCheckInClick}
                    onCheckOut={handleCheckOutClick}
                />
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

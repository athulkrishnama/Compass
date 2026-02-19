import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { createGetBookingDetailsQueryOptions } from "@/queryOptions/bookingQueryOptions";
import { BookingHeader } from "@/components/bookingDetails/BookingHeader";
import { HotelInfoCard } from "@/components/bookingDetails/HotelInfoCard";
import { RoomInfoCard } from "@/components/bookingDetails/RoomInfoCard";
import { TimelineSection } from "@/components/bookingDetails/TimelineSection";
import { AmenitiesSection } from "@/components/bookingDetails/AmenitiesSection";
import { PoliciesSection } from "@/components/bookingDetails/PoliciesSection";
import { GuestInfoBar } from "@/components/bookingDetails/GuestInfoBar";
import { PaymentFooter } from "@/components/bookingDetails/PaymentFooter";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

export default function BookingDetails() {
    const { bookingId } = useParams({
        from: "/traveler/booking/$bookingId",
    });
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { data } = useSuspenseQuery(
        createGetBookingDetailsQueryOptions(bookingId)
    );

    const booking = data.data!;

    return (
        <div className="min-h-screen bg-background">
            <div className="sticky top-4 z-10 max-w-5xl mx-auto px-4 sm:px-6">
                <button
                    onClick={() => navigate({ to: "/traveler/bookings" })}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-black/80 backdrop-blur-md rounded-full shadow-lg hover:shadow-xl hover:bg-black transition-all duration-300"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {t(translationKey.bookingDetails.backToBookings)}
                </button>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
                <BookingHeader
                    bookingStatus={booking.bookingStatus}
                    createdAt={booking.createdAt}
                    id={booking.id}
                    roomNumber={booking.roomNumber}
                    isWalkIn={booking.isWalkIn}
                />

                <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-6">
                    <HotelInfoCard hotel={booking.hotel} />
                    <RoomInfoCard roomVariant={booking.roomVariant} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <TimelineSection
                        checkInDate={booking.checkInDate}
                        checkOutDate={booking.checkOutDate}
                        checkInTime={booking.roomVariant.policies.checkInTime}
                        checkOutTime={booking.roomVariant.policies.checkOutTime}
                    />
                    <AmenitiesSection
                        amenities={booking.roomVariant.amenities}
                    />
                    <PoliciesSection policies={booking.roomVariant.policies} />
                </div>

                <GuestInfoBar maxOccupancy={booking.roomVariant.maxOccupancy} />

                <PaymentFooter
                    totalAmount={booking.totalAmount}
                    paymentIntendId={booking.paymentIntendId}
                    bookingStatus={booking.bookingStatus}
                    checkInDate={booking.checkInDate}
                    bookingId={bookingId}
                    refundAmount={booking.refundAmount}
                    refundStatus={booking.refundStatus}
                />
            </div>
        </div>
    );
}

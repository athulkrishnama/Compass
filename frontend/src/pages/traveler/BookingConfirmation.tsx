import { motion } from "framer-motion";
import { useSearch } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import HotelDetailsCard from "@/components/traveler/bookingConfirmation/HotelDetailsCard";
import RoomSelectionCard from "@/components/traveler/bookingConfirmation/RoomSelectionCard";
import StayDetailsCard from "@/components/traveler/bookingConfirmation/StayDetailsCard";
import PaymentSummaryCard from "@/components/traveler/bookingConfirmation/PaymentSummaryCard";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import { createGetRoomVariantByIdQueryOptions } from "@/queryOptions/roomVariantQueryOptions";
import { createGetHotelByIdQueryOptions } from "@/queryOptions/hotelQueryOptions";

import PaymentDetailsCard from "@/components/traveler/bookingConfirmation/PaymentDetailsCard";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export default function BookingConfirmation() {
    const { t } = useTranslation();
    const search = useSearch({ from: "/traveler/booking-confirmation" });
    const {
        roomVariantId,
        checkInDate,
        checkOutDate,
        guests,
        numberOfRooms,
        paymentIntentId,
        clientSecret,
        amount,
    } = search;

    const { data: roomVariantResponse } = useSuspenseQuery(
        createGetRoomVariantByIdQueryOptions(roomVariantId)
    );

    const roomVariant = roomVariantResponse?.data;

    const { data: hotelResponse } = useSuspenseQuery(
        createGetHotelByIdQueryOptions(roomVariant?.hotelId ?? "")
    );

    const hotel = hotelResponse?.data;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );

    const hotelData = {
        name: hotel?.name ?? "",
        address: `${hotel?.landMark}, ${hotel?.city}, ${hotel?.pinCode}, ${hotel?.country}`,
        description: hotel?.description ?? "",
        image: hotel?.coverImage ?? "",
    };

    const roomData = {
        name: roomVariant?.name ?? "",
        type: roomVariant?.name ?? "",
        bedConfig: `${roomVariant?.bedConfig.count} ${roomVariant?.bedConfig.type}`,
        amenities: roomVariant?.amenities ?? [],
        image: roomVariant?.coverImage ?? "",
    };

    console.log("Room Variant ID:", roomVariantId, "Guests:", guests);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 sm:mb-6 lg:mb-8"
                >
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5 sm:mb-2">
                        {t(translationKey.bookingConfirmation.confirmAndPay)}
                    </h1>
                    <p className="text-sm sm:text-base text-gray-500">
                        {t(
                            translationKey.bookingConfirmation.reviewStayDetails
                        )}
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
                >
                    <div className="lg:col-span-2 space-y-3 sm:space-y-4 min-w-0">
                        <HotelDetailsCard
                            name={hotelData.name}
                            address={hotelData.address}
                            description={hotelData.description}
                            image={hotelData.image}
                        />
                        <RoomSelectionCard
                            name={roomData.name}
                            type={roomData.type}
                            bedConfig={roomData.bedConfig}
                            amenities={roomData.amenities}
                            image={roomData.image}
                        />
                        <StayDetailsCard
                            checkInDate={checkIn}
                            checkOutDate={checkOut}
                            nights={nights}
                            numberOfRooms={numberOfRooms}
                        />
                        <PaymentDetailsCard
                            amount={amount}
                            nights={nights}
                            numberOfRooms={numberOfRooms}
                        />
                    </div>

                    <div className="lg:col-span-2 min-w-0">
                        <PaymentSummaryCard
                            amount={amount}
                            nights={nights}
                            numberOfRooms={numberOfRooms}
                            paymentIntentId={paymentIntentId}
                            clientSecret={clientSecret}
                        />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

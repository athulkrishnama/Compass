import { useParams } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { createGetRoomVariantByIdQueryOptions } from "@/queryOptions/roomVariantQueryOptions";
import { createGetHotelByIdQueryOptions } from "@/queryOptions/hotelQueryOptions";

import RoomImageGallery from "@/components/traveler/roomDetails/RoomImageGallery";
import RoomHeader from "@/components/traveler/roomDetails/RoomHeader";
import RoomDescription from "@/components/traveler/roomDetails/RoomDescription";
import RoomAmenities from "@/components/traveler/roomDetails/RoomAmenities";
import RoomPolicies from "@/components/traveler/roomDetails/RoomPolicies";
import HotelInfoCard from "@/components/traveler/roomDetails/HotelInfoCard";
import BookingWidget from "@/components/traveler/roomDetails/BookingWidget";

function RoomDetailsContent() {
    const { roomVariantId } = useParams({
        from: "/traveler/room/$roomVariantId",
    });
    const navigate = useNavigate();

    const { data: roomVariantResponse } = useSuspenseQuery(
        createGetRoomVariantByIdQueryOptions(roomVariantId)
    );

    const roomVariant = roomVariantResponse?.data;

    const { data: hotelResponse } = useSuspenseQuery(
        createGetHotelByIdQueryOptions(roomVariant?.hotelId ?? "")
    );

    const hotel = hotelResponse?.data;

    const handleGoBack = () => {
        if (hotel?.id) {
            navigate({
                to: "/traveler/hotel/$hotelId",
                params: { hotelId: hotel.id },
            });
        } else {
            navigate({ to: "/traveler/hotels" });
        }
    };

    if (!roomVariant || !hotel) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Room not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white relative">
            <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleGoBack}
                className="absolute top-12 left-12 z-50 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-xl hover:bg-white hover:scale-110 transition-all duration-300"
            >
                <ArrowLeft className="w-5 h-5 text-gray-900" />
            </motion.button>

            <RoomImageGallery
                coverImage={roomVariant.coverImage}
                images={roomVariant.images}
                roomName={roomVariant.name}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <RoomHeader
                            name={roomVariant.name}
                            description={roomVariant.description}
                        />

                        <RoomDescription
                            description={roomVariant.description}
                            maxOccupancy={roomVariant.maxOccupancy}
                            bedConfig={roomVariant.bedConfig}
                        />

                        <RoomAmenities amenities={roomVariant.amenities} />

                        <RoomPolicies policies={roomVariant.policies} />

                        <HotelInfoCard hotel={hotel} />
                    </div>

                    <div className="lg:col-span-1">
                        <BookingWidget
                            basePrice={roomVariant.basePrice}
                            maxOccupancy={roomVariant.maxOccupancy}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TravelerRoomDetails() {
    return <RoomDetailsContent />;
}

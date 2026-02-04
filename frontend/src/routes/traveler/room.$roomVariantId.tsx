import { createFileRoute } from "@tanstack/react-router";
import { createGetRoomVariantByIdQueryOptions } from "@/queryOptions/roomVariantQueryOptions";
import { createGetHotelByIdQueryOptions } from "@/queryOptions/hotelQueryOptions";
import TravelerRoomDetails from "@/pages/traveler/RoomDetails";
import { Suspense } from "react";

export const Route = createFileRoute("/traveler/room/$roomVariantId")({
    loader: async ({ context: { queryClient }, params: { roomVariantId } }) => {
        const roomVariantData = await queryClient.ensureQueryData(
            createGetRoomVariantByIdQueryOptions(roomVariantId)
        );

        if (roomVariantData?.data?.hotelId) {
            await queryClient.ensureQueryData(
                createGetHotelByIdQueryOptions(roomVariantData.data.hotelId)
            );
        }

        return { roomVariantId };
    },
    component: () => (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
            }
        >
            <TravelerRoomDetails />
        </Suspense>
    ),
});

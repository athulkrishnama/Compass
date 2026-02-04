import { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import Loading from "@/components/shared/loading/Loading";
import { createGetHotelByIdQueryOptions } from "@/queryOptions/hotelQueryOptions";
import { createGetRoomVariantByHotelIdQueryOptions } from "@/queryOptions/roomVariantQueryOptions";
import TravelerHotelDetails from "@/pages/traveler/HotelDetails";

export const Route = createFileRoute("/traveler/hotel/$hotelId")({
    loader: async ({ context, params }) => {
        await Promise.all([
            context.queryClient.ensureQueryData(
                createGetHotelByIdQueryOptions(params.hotelId)
            ),
            context.queryClient.ensureQueryData(
                createGetRoomVariantByHotelIdQueryOptions(params.hotelId)
            ),
        ]);
    },
    component: () => (
        <Suspense
            fallback={
                <div className="min-h-screen">
                    <Loading />
                </div>
            }
        >
            <TravelerHotelDetails />
        </Suspense>
    ),
});

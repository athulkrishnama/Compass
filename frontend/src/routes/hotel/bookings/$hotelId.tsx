import { createFileRoute } from "@tanstack/react-router";
import HotelBookingDetails from "@/pages/hotel/HotelBookingDetails";
import Loading from "@/components/shared/loading/Loading";
import { createGetHotelByIdQueryOptions } from "@/queryOptions/hotelQueryOptions";
import { createGetRoomVariantByHotelIdQueryOptions } from "@/queryOptions/roomVariantQueryOptions";

export const Route = createFileRoute("/hotel/bookings/$hotelId")({
    loader: ({ context: { queryClient }, params: { hotelId } }) => {
        queryClient.ensureQueryData(createGetHotelByIdQueryOptions(hotelId));
        queryClient.ensureQueryData(
            createGetRoomVariantByHotelIdQueryOptions(hotelId)
        );
    },
    component: HotelBookingDetails,
    pendingComponent: Loading,
});

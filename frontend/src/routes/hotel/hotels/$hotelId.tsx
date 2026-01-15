import Loading from "@/components/shared/loading/Loading";
import HotelDetails from "@/pages/hotel/HotelDetails";
import { createGetHotelByIdQueryOptions } from "@/queryOptions/hotelQueryOptions";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hotel/hotels/$hotelId")({
    loader: ({ context, params }) => {
        context.queryClient.ensureQueryData(
            createGetHotelByIdQueryOptions(params.hotelId)
        );
    },
    component: HotelDetails,
    pendingComponent: Loading,
});

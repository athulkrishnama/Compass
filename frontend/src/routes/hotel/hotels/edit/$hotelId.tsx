import Loading from "@/components/shared/loading/Loading";
import EditHotel from "@/pages/hotel/EditHotel";
import { createGetHotelByIdQueryOptions } from "@/queryOptions/hotelQueryOptions";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hotel/hotels/edit/$hotelId")({
    loader: ({ context, params }) => {
        context.queryClient.ensureQueryData(
            createGetHotelByIdQueryOptions(params.hotelId)
        );
    },
    component: EditHotel,
    pendingComponent: Loading,
});

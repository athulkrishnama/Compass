import AddRoomVariant from "@/pages/roomVariant/AddRoomVariant";
import Loading from "@/components/shared/loading/Loading";
import { createFileRoute } from "@tanstack/react-router";
import { createGetHotelByIdQueryOptions } from "@/queryOptions/hotelQueryOptions";

export const Route = createFileRoute(
    "/hotel/hotels/$hotelId_/room-variants/add"
)({
    loader: ({ context, params }) => {
        context.queryClient.ensureQueryData(
            createGetHotelByIdQueryOptions(params.hotelId)
        );
    },
    component: AddRoomVariant,
    pendingComponent: Loading,
});

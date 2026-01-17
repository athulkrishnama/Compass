import EditRoom from "@/pages/hotel/EditRoom";
import Loading from "@/components/shared/loading/Loading";
import { createFileRoute } from "@tanstack/react-router";
import { createGetRoomByIdQueryOptions } from "@/queryOptions/roomQueryOptions";
import { createGetHotelByIdQueryOptions } from "@/queryOptions/hotelQueryOptions";

export const Route = createFileRoute(
    "/hotel/hotels/$hotelId_/rooms/$roomId/edit"
)({
    loader: ({ context, params }) => {
        context.queryClient.ensureQueryData(
            createGetRoomByIdQueryOptions(params.roomId)
        );
        context.queryClient.ensureQueryData(
            createGetHotelByIdQueryOptions(params.hotelId)
        );
    },
    component: EditRoom,
    pendingComponent: Loading,
});

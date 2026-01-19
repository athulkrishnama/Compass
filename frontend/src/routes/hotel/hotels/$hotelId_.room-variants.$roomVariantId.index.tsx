import RoomVariantDetails from "@/pages/roomVariant/RoomVariantDetails";
import Loading from "@/components/shared/loading/Loading";
import { createFileRoute } from "@tanstack/react-router";
import { createGetRoomVariantByIdQueryOptions } from "@/queryOptions/roomVariantQueryOptions";
import { createGetHotelByIdQueryOptions } from "@/queryOptions/hotelQueryOptions";

export const Route = createFileRoute(
    "/hotel/hotels/$hotelId_/room-variants/$roomVariantId/"
)({
    loader: ({ context, params }) => {
        context.queryClient.ensureQueryData(
            createGetRoomVariantByIdQueryOptions(params.roomVariantId)
        );
    },
    component: RoomVariantDetails,
    pendingComponent: Loading,
});

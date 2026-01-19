import EditRoomVariant from "@/pages/roomVariant/EditRoomVariant";
import Loading from "@/components/shared/loading/Loading";
import { createFileRoute } from "@tanstack/react-router";
import { createGetRoomVariantByIdQueryOptions } from "@/queryOptions/roomVariantQueryOptions";
import { createGetHotelByIdQueryOptions } from "@/queryOptions/hotelQueryOptions";

export const Route = createFileRoute(
    "/hotel/hotels/$hotelId_/room-variants/$roomVariantId/edit"
)({
    loader: ({ context, params }) => {
        context.queryClient.ensureQueryData(
            createGetRoomVariantByIdQueryOptions(params.roomVariantId)
        );
        context.queryClient.ensureQueryData(
            createGetHotelByIdQueryOptions(params.hotelId)
        );
    },
    component: EditRoomVariant,
    pendingComponent: Loading,
});

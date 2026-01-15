import AddRoom from "@/pages/room/AddRoom";
import Loading from "@/components/shared/loading/Loading";
import { createFileRoute } from "@tanstack/react-router";
import { createGetHotelByIdQueryOptions } from "@/queryOptions/hotelQueryOptions";

export const Route = createFileRoute("/hotel/hotels/$hotelId_/rooms/add")({
    loader: ({ context, params }) => {
        context.queryClient.ensureQueryData(
            createGetHotelByIdQueryOptions(params.hotelId)
        );
    },
    component: AddRoom,
    pendingComponent: Loading,
});

import Loading from "@/components/shared/loading/Loading";
import Hotels from "@/pages/hotel/Hotels";
import { createGetHotelsByUserIdQueryOptions } from "@/queryOptions/hotelQueryOptions";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hotel/hotels/")({
    loader: ({ context }) => {
        context.queryClient.ensureQueryData(
            createGetHotelsByUserIdQueryOptions()
        );
    },
    component: Hotels,
    pendingComponent: Loading,
});

import Loading from "@/components/shared/loading/Loading";
import { createGetHotelsByUserIdQueryOptions } from "@/queryOptions/hotelQueryOptions";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/hotel/bookings")({
    loader: ({ context }) => {
        context.queryClient.ensureQueryData(
            createGetHotelsByUserIdQueryOptions()
        );
    },
    component: () => <Outlet />,
    pendingComponent: Loading,
});

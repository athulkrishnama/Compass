import { createFileRoute } from "@tanstack/react-router";
import DriverRideDetail from "@/pages/cab/DriverRideDetail";
import { getRideDetailsQueryOptions } from "@/queryOptions/rideQueryOptions";

export const Route = createFileRoute("/cab/ride/$id")({
    loader: async ({ context: { queryClient }, params: { id } }) => {
        return queryClient.ensureQueryData(getRideDetailsQueryOptions(id));
    },
    component: DriverRideDetail,
});

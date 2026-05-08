import RideDetails from "@/pages/traveler/cab/RideDetails";
import { getRideDetailsQueryOptions } from "@/queryOptions/rideQueryOptions";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/traveler/cab/ride/$id")({
    loader: async ({ context: { queryClient }, params: { id } }) => {
        return queryClient.ensureQueryData(getRideDetailsQueryOptions(id));
    },
    component: RideDetails,
});

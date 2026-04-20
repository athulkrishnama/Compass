import CabSearch from "@/pages/traveler/cab/CabSearch";
import { createCalculateFareQueryOptions } from "@/queryOptions/fareQueryOptions";
import { cabSearchParamsSchema } from "@/schemas/cabSearchParams";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/traveler/cab/search")({
    validateSearch: cabSearchParamsSchema,
    loaderDeps: ({ search }) => ({
        pickupLat: search.pickupLat,
        pickupLng: search.pickupLng,
        dropoffLat: search.dropoffLat,
        dropoffLng: search.dropoffLng,
    }),
    loader: async ({ context: { queryClient }, deps }) => {
        return queryClient.ensureQueryData(
            createCalculateFareQueryOptions({
                pickup: { latitude: deps.pickupLat, longitude: deps.pickupLng },
                dropoff: {
                    latitude: deps.dropoffLat,
                    longitude: deps.dropoffLng,
                },
            })
        );
    },
    component: CabSearch,
});

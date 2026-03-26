import CabSearch from "@/pages/traveler/cab/CabSearch";
import { cabSearchParamsSchema } from "@/schemas/cabSearchParams";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/traveler/cab/search")({
    validateSearch: cabSearchParamsSchema,
    component: CabSearch,
});

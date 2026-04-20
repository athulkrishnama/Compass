import cabHome from "@/pages/traveler/cab/cabHome";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/traveler/cab/")({
    component: cabHome,
});

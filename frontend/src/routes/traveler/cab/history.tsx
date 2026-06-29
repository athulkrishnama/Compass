import CabHistory from "@/pages/traveler/cab/cabHistory";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/traveler/cab/history")({
    component: CabHistory,
});

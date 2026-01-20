import { createFileRoute } from "@tanstack/react-router";
import Destinations from "@/pages/traveler/Destinations";

export const Route = createFileRoute("/traveler/destinations")({
    component: Destinations,
});

import { createFileRoute } from "@tanstack/react-router";
import DriverPastTrips from "@/pages/cab/PastTrips";

export const Route = createFileRoute("/cab/history")({
    component: DriverPastTrips,
});

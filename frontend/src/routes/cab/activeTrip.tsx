import { createFileRoute } from "@tanstack/react-router";
import ActiveTripPage from "@/pages/cab/ActiveTrip";

export const Route = createFileRoute("/cab/activeTrip")({
    component: ActiveTripPage,
});

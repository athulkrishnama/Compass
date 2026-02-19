import { createFileRoute } from "@tanstack/react-router";
import Bookings from "@/pages/traveler/Bookings";

export const Route = createFileRoute("/traveler/bookings")({
    component: Bookings,
});

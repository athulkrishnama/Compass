import { createFileRoute } from "@tanstack/react-router";
import HotelBookings from "@/pages/hotel/HotelBookings";

export const Route = createFileRoute("/hotel/bookings/")({
    component: HotelBookings,
});

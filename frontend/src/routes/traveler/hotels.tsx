import { createFileRoute } from "@tanstack/react-router";
import HotelSearch from "@/pages/traveler/HotelSearch";

export const Route = createFileRoute("/traveler/hotels")({
    component: HotelSearch,
});

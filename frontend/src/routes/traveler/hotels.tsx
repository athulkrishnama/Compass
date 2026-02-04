import { createFileRoute } from "@tanstack/react-router";
import HotelSearch from "@/pages/traveler/HotelSearch";
import { hotelSearchParamsSchema } from "../../schemas/hotelSearchParams";

export const Route = createFileRoute("/traveler/hotels")({
    component: HotelSearch,
    validateSearch: hotelSearchParamsSchema,
});

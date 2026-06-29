import { createFileRoute } from "@tanstack/react-router";
import HotelOwnerReviews from "@/pages/hotel/HotelOwnerReviews";

export const Route = createFileRoute("/hotel/reviews")({
    component: HotelOwnerReviews,
});

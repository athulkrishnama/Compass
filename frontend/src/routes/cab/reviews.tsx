import { createFileRoute } from "@tanstack/react-router";
import DriverReviews from "@/pages/cab/DriverReviews";

export const Route = createFileRoute("/cab/reviews")({
    component: DriverReviews,
});

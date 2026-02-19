import { createFileRoute } from "@tanstack/react-router";
import OverallDashboard from "@/pages/hotel/OverallDashboard";

export const Route = createFileRoute("/hotel/")({
    component: OverallDashboard,
});

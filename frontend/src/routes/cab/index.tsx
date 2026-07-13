import { createFileRoute } from "@tanstack/react-router";
import { CabDashboard } from "@/components/cab/dashboard/CabDashboard";

export const Route = createFileRoute("/cab/")({
    component: CabDashboard,
});

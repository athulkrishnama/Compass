import Destinations from "@/pages/admin/Destinations";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/destinations")({
    component: Destinations,
});

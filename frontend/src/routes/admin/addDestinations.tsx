import AddDestinations from "@/pages/admin/AddDestinations";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/addDestinations")({
    component: AddDestinations,
});

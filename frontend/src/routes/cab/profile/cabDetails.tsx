import CabDetails from "@/pages/cab/profile/CabDetails";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cab/profile/cabDetails")({
    component: CabDetails,
});

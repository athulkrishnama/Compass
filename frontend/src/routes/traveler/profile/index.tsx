import UserDetails from "@/pages/traveler/profile/UserDetails";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/traveler/profile/")({
    component: UserDetails,
});

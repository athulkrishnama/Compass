import UserDetails from "@/pages/hotel/profile/UserDetails";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hotel/profile/")({
    component: UserDetails,
});

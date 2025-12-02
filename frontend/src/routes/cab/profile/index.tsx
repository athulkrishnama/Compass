import UserDetails from "@/pages/cab/profile/UserDetails";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cab/profile/")({
    component: UserDetails,
});

import ProfileLayout from "@/pages/hotel/profile/ProfileLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hotel/profile")({
    component: ProfileLayout,
});

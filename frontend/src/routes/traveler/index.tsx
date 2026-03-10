import LandingPage from "@/components/traveler/landingPage/LandingPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/traveler/")({
    component: LandingPage,
});

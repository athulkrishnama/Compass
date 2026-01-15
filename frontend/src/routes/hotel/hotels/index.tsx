import Hotels from "@/pages/hotel/Hotels";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hotel/hotels/")({
    component: Hotels,
});

import HotelVerification from "@/pages/admin/HotelVerification";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/hotelVerification")({
    component: HotelVerification,
});

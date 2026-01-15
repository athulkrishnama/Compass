import AddHotel from "@/pages/hotel/AddHotel";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hotel/hotels/add")({
    component: AddHotel,
});

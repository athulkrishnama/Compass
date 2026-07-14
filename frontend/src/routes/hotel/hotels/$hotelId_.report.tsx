import { createFileRoute } from "@tanstack/react-router";
import HotelReportPage from "@/pages/hotel/HotelReport";

export const Route = createFileRoute("/hotel/hotels/$hotelId_/report")({
    component: RouteComponent,
});

function RouteComponent() {
    return <HotelReportPage />;
}

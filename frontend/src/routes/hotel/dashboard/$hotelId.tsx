import { createFileRoute } from "@tanstack/react-router";
import HotelDashboard from "@/pages/hotel/HotelDashboard";
import { createHotelDashboardQueryOptions } from "@/queryOptions/dashboardQueryOptions";

export const Route = createFileRoute("/hotel/dashboard/$hotelId")({
    loader: ({ context: { queryClient }, params: { hotelId } }) =>
        queryClient.ensureQueryData(createHotelDashboardQueryOptions(hotelId)),
    component: HotelDashboard,
});

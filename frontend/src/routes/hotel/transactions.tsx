import { createFileRoute } from "@tanstack/react-router";
import HotelTransactions from "@/pages/hotel/HotelTransactions";

export const Route = createFileRoute("/hotel/transactions")({
    component: HotelTransactions,
});

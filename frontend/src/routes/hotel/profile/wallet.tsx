import Wallet from "@/pages/hotel/profile/Wallet";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hotel/profile/wallet")({
    component: Wallet,
});

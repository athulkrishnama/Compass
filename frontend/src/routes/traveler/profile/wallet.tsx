import Wallet from "@/pages/traveler/profile/Wallet";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/traveler/profile/wallet")({
    component: Wallet,
});

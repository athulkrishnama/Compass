import { createFileRoute } from "@tanstack/react-router";
import WalletPage from "@/pages/traveler/Wallet";

export const Route = createFileRoute("/traveler/wallet")({
    component: WalletPage,
});

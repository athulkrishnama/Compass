import { createFileRoute } from "@tanstack/react-router";
import WalletPage from "@/pages/hotel/Wallet";

export const Route = createFileRoute("/hotel/wallet")({
    component: WalletPage,
});

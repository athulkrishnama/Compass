import { createFileRoute } from "@tanstack/react-router";
import WalletPage from "@/pages/cab/Wallet";

export const Route = createFileRoute("/cab/wallet")({
    component: WalletPage,
});

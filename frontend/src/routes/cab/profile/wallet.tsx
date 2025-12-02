import Wallet from "@/pages/cab/profile/Wallet";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cab/profile/wallet")({
    component: Wallet,
});

import CabVerification from "@/pages/admin/CabVerification";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/cabVerification")({
    component: CabVerification,
});

import { createFileRoute } from "@tanstack/react-router";
import AdminTransactions from "@/pages/admin/AdminTransactions";

export const Route = createFileRoute("/admin/transactions")({
    component: AdminTransactions,
});

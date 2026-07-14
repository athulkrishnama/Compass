import { createFileRoute } from "@tanstack/react-router";
import AdminReportsPage from "@/pages/admin/AdminReports";

export const Route = createFileRoute("/admin/reports")({
    component: RouteComponent,
});

function RouteComponent() {
    return <AdminReportsPage />;
}

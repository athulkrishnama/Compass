import { createFileRoute } from "@tanstack/react-router";
import CabReportPage from "@/pages/cab/CabReport";

export const Route = createFileRoute("/cab/reports")({
    component: RouteComponent,
});

function RouteComponent() {
    return <CabReportPage />;
}

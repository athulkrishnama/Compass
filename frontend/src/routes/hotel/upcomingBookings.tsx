import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hotel/upcomingBookings")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/hotel/upcomingBookings"!</div>;
}

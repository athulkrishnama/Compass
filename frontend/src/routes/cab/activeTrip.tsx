import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cab/activeTrip")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/cab/activeTrip"!</div>;
}

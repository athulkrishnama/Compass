import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/traveler/")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>User home</div>;
}

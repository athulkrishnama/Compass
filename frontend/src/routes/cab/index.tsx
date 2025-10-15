import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cab/")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/cab/"!</div>;
}

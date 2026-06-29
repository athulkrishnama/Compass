import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/cab/")({
    beforeLoad: () => {
        throw redirect({ to: "/cab/profile", replace: true });
    },
});

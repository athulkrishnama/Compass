import { ROLES } from "@/constants/roles";
import Login from "@/pages/cab/Login";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/cab/login")({
    component: Login,
    beforeLoad: ({ context }) => {
        if (context.isLoggedin() && context.checkRole(ROLES.CAB)) {
            throw redirect({ to: "/cab" });
        }
    },
});

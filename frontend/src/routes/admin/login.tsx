import { ROLES } from "@/constants/roles";
import Login from "@/pages/admin/Login";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/login")({
    component: Login,
    beforeLoad: ({ context }) => {
        if (context.isLoggedin() && context.checkRole(ROLES.ADMIN)) {
            throw redirect({ to: "/admin" });
        }
    },
});

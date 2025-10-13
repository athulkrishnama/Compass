import { ROLES } from "@/constants/roles";
import Login from "@/pages/hotel/Login";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/hotel/login")({
    component: Login,
    beforeLoad: ({ context }) => {
        if (context.isLoggedin() && context.checkRole(ROLES.HOTEL)) {
            throw redirect({ to: "/hotel" });
        }
    },
});

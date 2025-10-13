import { ROLES } from "@/constants/roles";
import Login from "@/pages/traveler/Login";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/traveler/login")({
    component: Login,
    beforeLoad: ({ context }) => {
        if (context.isLoggedin() && context.checkRole(ROLES.TRAVELER)) {
            throw redirect({ to: "/" });
        }
    },
});

import Navbar from "@/components/shared/Navbar/Navbar";
import { ROLES } from "@/constants/roles";
import type { FileRoutesByTo } from "@/routeTree.gen";
import translationKey from "@/utils/i18n/translationKey";
import {
    createFileRoute,
    Outlet,
    redirect,
    useLocation,
} from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/hotel")({
    component: RouteComponent,
    beforeLoad: ({ context, location }) => {
        const allowedRoutes: (keyof FileRoutesByTo)[] = [
            "/hotel/login",
            "/hotel/forgetPassword",
            "/hotel/signup",
        ];
        if (
            (!context.isLoggedin() || !context.checkRole(ROLES.HOTEL)) &&
            !allowedRoutes.includes(location.pathname as keyof FileRoutesByTo)
        ) {
            throw redirect({ to: "/hotel/login", replace: true });
        }
    },
});

function RouteComponent() {
    const { pathname } = useLocation();
    const { t } = useTranslation();

    const routes = [
        { name: t(translationKey.button.home), route: "/hotel" },

        {
            name: t(translationKey.button.upcomingBookings),
            route: "/hotel/upcomingBookings",
        },
        { name: t(translationKey.button.history), route: "/hotel/history" },
        { name: t(translationKey.button.profile), route: "/hotel/profile" },
    ];
    return (
        <div className="h-full w-full">
            {[
                "/hotel/login",
                "/hotel/signup",
                "/hotel/forgetPassword",
            ].includes(pathname) ? (
                <Outlet />
            ) : (
                <div className="h-full w-full flex flex-col">
                    <Navbar routes={routes} logoutRoute="/hotel/login" />
                    <Outlet />
                </div>
            )}
        </div>
    );
}

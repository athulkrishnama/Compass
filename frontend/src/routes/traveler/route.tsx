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
export const Route = createFileRoute("/traveler")({
    component: RouteComponent,
    beforeLoad: ({ context, location }) => {
        const allowedRoutes: (keyof FileRoutesByTo)[] = [
            "/traveler/login",
            "/traveler/signup",
            "/traveler/forgetPassword",
        ];
        if (
            (!context.isLoggedin() || !context.checkRole(ROLES.TRAVELER)) &&
            !allowedRoutes.includes(location.pathname as keyof FileRoutesByTo)
        ) {
            throw redirect({ to: "/traveler/login", replace: true });
        }
    },
});

function RouteComponent() {
    const { pathname } = useLocation();
    const { t } = useTranslation();

    const routes = [
        { name: t(translationKey.button.home), route: "/traveler" },
        {
            name: t(translationKey.button.bookings),
            route: "/traveler/bookings",
        },
        { name: t(translationKey.button.history), route: "/traveler/history" },
        { name: t(translationKey.button.profile), route: "/traveler/profile" },
    ];
    return (
        <div className="h-full w-full">
            {[
                "/traveler/login",
                "/traveler/signup",
                "/traveler/forgetPassword",
            ].includes(pathname) ? (
                <Outlet />
            ) : (
                <div className="h-full w-full flex flex-col">
                    <Navbar routes={routes} logoutRoute="/traveler/login" />
                    <div className="grow">
                        <Outlet />
                    </div>
                </div>
            )}
        </div>
    );
}

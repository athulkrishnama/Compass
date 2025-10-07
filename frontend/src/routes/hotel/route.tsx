import Navbar from "@/components/shared/Navbar/Navbar";
import translationKey from "@/utils/i18n/translationKey";
import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/hotel")({
    component: RouteComponent,
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
                <div className="h-full w-full">
                    <Navbar routes={routes} logoutRoute="/hotel/login" />
                    <Outlet />
                </div>
            )}
        </div>
    );
}

import Navbar from "@/components/shared/Navbar/Navbar";
import translationKey from "@/utils/i18n/translationKey";
import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/cab")({
    component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();
  const {t} = useTranslation()

  const routes = [
    {name: t(translationKey.button.home), route: "/cab"},
    {name: t(translationKey.button.acitveTrip), route: "/cab/acitveTrip"},
    {name: t(translationKey.button.bookings), route: "/cab/bookings"},
    {name: t(translationKey.button.history), route: "/cab/history"},
    {name: t(translationKey.button.profile), route: "/cab/profile"},
  ]
  return (
        <div className="h-full w-full">
            {[
                "/cab/login",
                "/cab/signup",
                "/cab/forgetPassword",
            ].includes(pathname) ? (
                <Outlet />
            ) : (
                <div className="h-full w-full">
                    <Navbar routes={routes} logoutRoute="/cab/login"/>
                    <Outlet />
                </div>
            )}
        </div>
    );
}
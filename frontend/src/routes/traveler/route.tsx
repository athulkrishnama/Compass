import Navbar from "@/components/shared/Navbar/Navbar";
import translationKey from "@/utils/i18n/translationKey";
import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
export const Route = createFileRoute("/traveler")({
    component: RouteComponent,
});


function RouteComponent() {
  const { pathname } = useLocation();
  const {t} = useTranslation()

  const routes = [
    {name: t(translationKey.button.home), route: "/traveler"},
    {name: t(translationKey.button.bookings), route: "/traveler/bookings"},
    {name: t(translationKey.button.history), route: "/traveler/history"},
    {name: t(translationKey.button.profile), route: "/traveler/profile"},
  ]
  return (
        <div className="h-full w-full">
            {[
                "/traveler/login",
                "/traveler/signup",
                "/traveler/forgetPassword",
            ].includes(pathname) ? (
                <Outlet />
            ) : (
                <div className="h-full w-full">
                    <Navbar routes={routes} logoutRoute="/traveler/login"/>
                    <Outlet />
                </div>
            )}
        </div>
    );
}

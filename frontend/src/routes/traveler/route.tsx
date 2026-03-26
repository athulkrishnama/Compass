import CommonErrorComponent from "@/components/errorBoundries/CommonErrorComponent";
import NotFoundComponent from "@/components/notFound";
import Navbar from "@/components/shared/Navbar/Navbar";
import { ROLES } from "@/constants/roles";
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
        const allowedRoutes: string[] = [
            "/traveler/login",
            "/traveler/signup",
            "/traveler/forgetPassword",
            "/traveler/destinations",
            "/traveler/hotels",
            "/traveler",
            "/traveler/",
        ];

        const isAllowedRoute =
            allowedRoutes.includes(location.pathname) ||
            location.pathname.startsWith("/traveler/destination/");

        if (
            (!context.isLoggedin() || !context.checkRole(ROLES.TRAVELER)) &&
            !isAllowedRoute
        ) {
            throw redirect({ to: "/traveler/login", replace: true });
        }
    },
    errorComponent: (error) => {
        console.log(error);
        return <CommonErrorComponent />;
    },
    notFoundComponent: NotFoundComponent,
});

function RouteComponent() {
    const { pathname } = useLocation();
    const { t } = useTranslation();

    const routes = [
        { name: t(translationKey.button.home), route: "/traveler" },
        {
            name: t(translationKey.button.destinations),
            route: "/traveler/destinations",
        },
        {
            name: t(translationKey.button.hotels),
            route: "/traveler/hotels",
        },
        {
            name: t(translationKey.button.bookings),
            route: "/traveler/bookings",
        },
        { name: t(translationKey.button.history), route: "/traveler/history" },
        { name: t(translationKey.button.profile), route: "/traveler/profile" },
        { name: t(translationKey.button.cabs), route: "/traveler/cabs" },
    ];

    const noNavbarRoutes = [
        "/traveler/login",
        "/traveler/signup",
        "/traveler/forgetPassword",
        "/traveler",
        "/traveler/",
    ];
    const hideNavbar = noNavbarRoutes.includes(pathname);

    return (
        <div className="h-full w-full">
            {hideNavbar ? (
                <Outlet />
            ) : (
                <div className="h-full max-h-screen w-full flex flex-col">
                    <Navbar routes={routes} logoutRoute="/traveler/login" />
                    <div className="grow overflow-y-auto hide-scroll-bar">
                        <Outlet />
                    </div>
                </div>
            )}
        </div>
    );
}

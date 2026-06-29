import CommonErrorComponent from "@/components/errorBoundries/CommonErrorComponent";
import NotFoundComponent from "@/components/notFound";
import Navbar from "@/components/shared/Navbar/Navbar";
import RideRequestPopup from "@/components/cab/RidePopup/RideRequestPopup";
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
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export const Route = createFileRoute("/cab")({
    component: RouteComponent,
    beforeLoad: ({ context, location }) => {
        const allowedRoutes: (keyof FileRoutesByTo)[] = [
            "/cab/login",
            "/cab/forgetPassword",
            "/cab/signup",
        ];

        if (
            (!context.isLoggedin() || !context.checkRole(ROLES.CAB)) &&
            !allowedRoutes.includes(location.pathname as keyof FileRoutesByTo)
        ) {
            throw redirect({ to: "/cab/login", replace: true });
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
    const { isOpen } = useSelector(
        (state: RootState) => state.rideRequestPopup
    );

    const routes = [
        { name: t(translationKey.button.home), route: "/cab" },
        { name: t(translationKey.button.acitveTrip), route: "/cab/activeTrip" },
        { name: t(translationKey.button.history), route: "/cab/history" },
        { name: t(translationKey.button.reviews), route: "/cab/reviews" },
        { name: t(translationKey.button.wallet), route: "/cab/wallet" },
        { name: t(translationKey.button.profile), route: "/cab/profile" },
    ];
    return (
        <div className="h-full w-full">
            {["/cab/login", "/cab/signup", "/cab/forgetPassword"].includes(
                pathname
            ) ? (
                <Outlet />
            ) : (
                <div className="h-full w-full flex flex-col">
                    <Navbar routes={routes} logoutRoute="/cab/login" />
                    <Outlet />
                </div>
            )}
            {isOpen && <RideRequestPopup />}
        </div>
    );
}

import SideBar from "@/components/admin/SideBar";
import { ROLES } from "@/constants/roles";
import type { FileRoutesByTo } from "@/routeTree.gen";
import {
    createFileRoute,
    Outlet,
    redirect,
    useLocation,
} from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
    component: RouteComponent,
    beforeLoad: ({ context, location }) => {
        const allowedRoutes: (keyof FileRoutesByTo)[] = ["/admin/login"];
        if (
            (!context.isLoggedin() || !context.checkRole(ROLES.ADMIN)) &&
            !allowedRoutes.includes(location.pathname as keyof FileRoutesByTo)
        ) {
            throw redirect({ to: "/admin/login", replace: true });
        }
    },
});

function RouteComponent() {
    const location = useLocation();
    return location.pathname === "/admin/login" ? (
        <Outlet />
    ) : (
        <div className="flex h-screen w-full">
            <div>
                <SideBar />
            </div>

            <div className="flex-grow bg-gray-50 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
}

import SideBar from "@/components/admin/SideBar";
import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
    component: RouteComponent,
});

function RouteComponent() {
    const location = useLocation();
    console.log(location.pathname);
    return location.pathname === "/admin/login" ? (
        <Outlet />
    ) : (
        <div className="flex h-screen w-full">
            <SideBar />

            <div className="flex-grow bg-gray-50 p-6 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
}

import translationKey from "@/utils/i18n/translationKey";
import { useTranslation } from "react-i18next";
import logo from "@/assets/images/logo.png";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { createLogoutQueryOptions } from "@/queryOptions/authQueryOptions";
import { toast } from "sonner";

interface propTypes {
    routes: {
        name: string;
        route: string;
    }[];
    logoutRoute: string;
}

function Navbar({ routes, logoutRoute }: propTypes) {
    const { t } = useTranslation();
    const { location } = useRouterState();

    const { mutate } = useMutation(createLogoutQueryOptions());
    const navigate = useNavigate();

    function handleLogout() {
        mutate(undefined, {
            onSuccess: (response) => {
                toast.success(response.message);
            },
            onError: (err) => {
                toast.error(err.message);
            },
            onSettled: () => {
                navigate({ to: logoutRoute, replace: true });
            },
        });
    }

    return (
        <nav className="flex items-center justify-between px-6 py-3 bg-white shadow-md">
            <div className="flex items-center space-x-3 ">
                <img
                    src={logo}
                    alt="Logo"
                    className="h-10 w-10 object-contain"
                />
                <span className="text-4xl font-semibold text-gray-800 nerko-one">
                    {t(translationKey.brand.name)}
                </span>
            </div>
            <div className="flex-1 flex justify-center space-x-6">
                {routes.map(({ name, route }) => {
                    const isActive = location.pathname === route;
                    return (
                        <Link
                            key={route}
                            to={route}
                            className={`px-4 py-2 rounded-md font-medium transition-colors duration-200
              ${
                  isActive
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
              }`}
                        >
                            {name}
                        </Link>
                    );
                })}
            </div>

            <div>
                <Button
                    onClick={handleLogout}
                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
                >
                    {t(translationKey.button.logout)}
                </Button>
            </div>
        </nav>
    );
}

export default Navbar;

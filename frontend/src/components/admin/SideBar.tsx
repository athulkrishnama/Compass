import logo from "@/assets/images/logo.png";
import translationKey from "@/utils/i18n/translationKey";
import { useTranslation } from "react-i18next";
import { Link, useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export default function SideBar() {
    const router = useRouterState();
    const currentPath = router.location.pathname;
    const { t } = useTranslation();

    const links = [
        { to: "/admin", label: t(translationKey.button.dashboard) },
        { to: "/admin/users", label: t(translationKey.button.users) },
        { to: "/admin/reports", label: t(translationKey.button.reports) },
    ];

    return (
        <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
            <div className="p-6 flex items-center space-x-3">
                <img
                    src={logo}
                    alt="Logo"
                    className="w-10 h-10 object-contain"
                />
                <h1 className="text-4xl font-bold text-gray-800 nerko-one">
                    {t(translationKey.brand.name)}
                </h1>
            </div>

            <div className="flex flex-col space-y-2 px-4">
                {links.map((link) => {
                    const isActive = currentPath === link.to;
                    return (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`block px-4 py-2 rounded-lg font-medium transition-colors ${
                                isActive
                                    ? "bg-black text-white"
                                    : "text-gray-800 hover:bg-gray-100"
                            }`}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-gray-200">
                <Button className="w-full bg-red-600 text-white hover:bg-red-500 transition-colors">
                    {t(translationKey.button.logout)}
                </Button>
            </div>
        </div>
    );
}

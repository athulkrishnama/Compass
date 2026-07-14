import logo from "@/assets/images/logo.png";
import translationKey from "@/utils/i18n/translationKey";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { createLogoutQueryOptions } from "@/queryOptions/authQueryOptions";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
    Car,
    Home,
    Hotel,
    LogOut,
    Map,
    User,
    Wallet,
    FileText,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { removeToken } from "@/store/slices/tokenSlice";
import { removeUser } from "@/store/slices/userSlice";

export default function SideBar() {
    const router = useRouterState();
    const currentPath = router.location.pathname;
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const links = [
        {
            to: "/admin",
            label: t(translationKey.button.dashboard),
            icon: <Home className="w-5 h-5" />,
        },
        {
            to: "/admin/users",
            label: t(translationKey.button.users),
            icon: <User className="w-5 h-5" />,
        },
        {
            to: "/admin/reports",
            label: t(translationKey.reports.title),
            icon: <FileText className="w-5 h-5" />,
        },
        {
            to: "/admin/hotelVerification",
            label: t(translationKey.button.hotelVerification),
            icon: <Hotel className="w-5 h-5" />,
        },
        {
            to: "/admin/cabVerification",
            label: t(translationKey.headings.cabVerification),
            icon: <Car className="w-t h-5" />,
        },
        {
            to: "/admin/destinations",
            label: t(translationKey.headings.destinations),
            icon: <Map className="w-t h-5" />,
        },
        {
            to: "/admin/transactions",
            label: t(translationKey.transactions.adminTitle),
            icon: <Wallet className="w-5 h-5" />,
        },
    ];

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
                dispatch(removeToken());
                dispatch(removeUser());
                navigate({ to: "/admin/login", replace: true });
            },
        });
    }

    return (
        <motion.div
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -200, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col justify-between shadow-lg"
        >
            <div className="p-6 flex items-center space-x-3">
                <img
                    src={logo}
                    alt="Logo"
                    className="w-10 h-10 object-contain"
                />
                <h1 className="text-3xl font-bold text-gray-900 nerko-one">
                    {t(translationKey.brand.name)}
                </h1>
            </div>

            <nav className="flex-1 flex flex-col px-4 space-y-2">
                {links.map((link) => {
                    const isActive = currentPath === link.to;
                    return (
                        <motion.div
                            key={link.to}
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Link
                                to={link.to}
                                className={`flex items-center space-x-3 px-4 py-2 rounded-lg font-medium text-gray-900 transition-colors ${
                                    isActive
                                        ? "bg-black text-white"
                                        : "hover:bg-gray-100 hover:text-gray-900"
                                }`}
                            >
                                {link.icon}
                                <span>{link.label}</span>
                            </Link>
                        </motion.div>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-200">
                <Button
                    className="w-full flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-900 transition-colors"
                    onClick={handleLogout}
                >
                    <LogOut className="w-4 h-4" />
                    {t(translationKey.button.logout)}
                </Button>
            </div>
        </motion.div>
    );
}

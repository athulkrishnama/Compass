import translationKey from "@/utils/i18n/translationKey";
import { useTranslation } from "react-i18next";
import logo from "@/assets/images/logo.png";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { createLogoutQueryOptions } from "@/queryOptions/authQueryOptions";
import { toast } from "sonner";
import { Languages, type Langtype } from "@/types/langType";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { LanguagesIcon, LogIn, LogOut, Menu, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { setLanguage } from "@/store/slices/langSlice";
import i18next from "i18next";
import { removeToken } from "@/store/slices/tokenSlice";
import { removeUser } from "@/store/slices/userSlice";
import { motion, AnimatePresence } from "framer-motion";
import { isLoggedin } from "@/utils/authChecker";
import { useState } from "react";
import { NotificationBell } from "../notification/NotificationBell";

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
    const lang = useAppSelector((state) => state.lang.lang);
    const dispatch = useAppDispatch();

    const { mutate } = useMutation(createLogoutQueryOptions());
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);

    function handleLogout() {
        mutate(undefined, {
            onSuccess: (response) => {
                toast.success(response.message);
                setIsOpen(false);
            },
            onError: (err) => {
                toast.error(err.message);
            },
            onSettled: () => {
                dispatch(removeUser());
                dispatch(removeToken());
                navigate({ to: logoutRoute, replace: true });
            },
        });
    }

    function handleLanguageChange(lang: Langtype) {
        i18next.changeLanguage(lang);
        dispatch(setLanguage(lang as Langtype));
        document.documentElement.setAttribute("lang", lang);
    }

    function handleRedirectToLogin() {
        navigate({ to: logoutRoute });
        setIsOpen(false);
    }

    return (
        <nav className="sticky top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <motion.div
                        className="flex-shrink-0 flex items-center gap-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <img
                            src={logo}
                            alt="Logo"
                            className="h-8 w-8 object-contain"
                        />
                        <span className="text-2xl font-semibold text-gray-900 nerko-one">
                            {t(translationKey.brand.name)}
                        </span>
                    </motion.div>

                    <div className="hidden lg:flex flex-1 items-center justify-center space-x-8">
                        {routes.map(({ name, route }) => {
                            const isActive = location.pathname === route;
                            return (
                                <Link
                                    key={route}
                                    to={route}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                        isActive
                                            ? "text-black bg-gray-100"
                                            : "text-gray-600 hover:text-black hover:bg-gray-50"
                                    }`}
                                >
                                    {name}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="hidden lg:flex items-center gap-4">
                        {isLoggedin() && <NotificationBell />}
                        <Select
                            value={lang}
                            onValueChange={handleLanguageChange}
                        >
                            <SelectTrigger className="w-[120px] bg-gray-50 border-gray-200 focus:ring-black">
                                <LanguagesIcon className="mr-2 h-4 w-4 text-gray-500" />
                                <SelectValue placeholder="Lang" />
                            </SelectTrigger>
                            <SelectContent>
                                {Languages.map((l, i) => (
                                    <SelectItem key={i} value={l}>
                                        {l}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {isLoggedin() ? (
                            <Button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
                            >
                                <LogOut className="w-4 h-4" />
                                {t(translationKey.button.logout)}
                            </Button>
                        ) : (
                            <Button
                                onClick={handleRedirectToLogin}
                                variant="outline"
                                className="flex items-center gap-2 border-black text-black hover:bg-gray-100"
                            >
                                <LogIn className="w-4 h-4" />
                                {t(translationKey.button.signin)}
                            </Button>
                        )}
                    </div>

                    <div className="flex lg:hidden items-center gap-2">
                        {isLoggedin() && <NotificationBell />}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 focus:outline-none"
                        >
                            <span className="sr-only">
                                {t(translationKey.common.openMainMenu)}
                            </span>
                            {isOpen ? (
                                <X className="block h-6 w-6" />
                            ) : (
                                <Menu className="block h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="lg:hidden bg-white border-b border-gray-200 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-4">
                            <div className="space-y-1">
                                {routes.map(({ name, route }) => {
                                    const isActive =
                                        location.pathname === route;
                                    return (
                                        <Link
                                            key={route}
                                            to={route}
                                            onClick={() => setIsOpen(false)}
                                            className={`block px-3 py-2 rounded-md text-base font-medium ${
                                                isActive
                                                    ? "bg-gray-100 text-black"
                                                    : "text-gray-600 hover:text-black hover:bg-gray-50"
                                            }`}
                                        >
                                            {name}
                                        </Link>
                                    );
                                })}
                            </div>

                            <div className="pt-4 border-t border-gray-100 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-500">
                                        {t(translationKey.common.language)}
                                    </span>
                                    <Select
                                        value={lang}
                                        onValueChange={handleLanguageChange}
                                    >
                                        <SelectTrigger className="w-[140px]">
                                            <LanguagesIcon className="mr-2 h-4 w-4" />
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Languages.map((l, i) => (
                                                <SelectItem key={i} value={l}>
                                                    {l}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {isLoggedin() ? (
                                    <Button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        {t(translationKey.button.logout)}
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleRedirectToLogin}
                                        className="w-full flex items-center justify-center gap-2"
                                        variant="outline"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        {t(translationKey.button.signin)}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

export default Navbar;

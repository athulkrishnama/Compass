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
import { LanguagesIcon, LogIn, LogOut } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { setLanguage } from "@/store/slices/langSlice";
import i18next from "i18next";
import { removeToken } from "@/store/slices/tokenSlice";
import { removeUser } from "@/store/slices/userSlice";
import { motion } from "framer-motion";
import { isLoggedin } from "@/utils/authChecker";

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

    function handleLogout() {
        mutate(undefined, {
            onSuccess: (response) => {
                toast.success(response.message);
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
    }

    return (
        <nav className="flex items-center justify-between px-8 py-4 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <motion.div
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
            >
                <img
                    src={logo}
                    alt="Logo"
                    className="h-10 w-10 object-contain"
                />
                <span className="text-3xl font-semibold text-gray-900 nerko-one">
                    {t(translationKey.brand.name)}
                </span>
            </motion.div>

            <motion.div
                className="flex-1 flex justify-center space-x-6"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
            >
                {routes.map(({ name, route }) => {
                    const isActive = location.pathname === route;
                    return (
                        <motion.div whileHover={{ y: -1 }} key={route}>
                            <Link
                                to={route}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
              ${
                  isActive
                      ? "bg-black text-white shadow-sm"
                      : "text-gray-700 hover:text-black hover:bg-gray-100"
              }`}
                            >
                                {name}
                            </Link>
                        </motion.div>
                    );
                })}
            </motion.div>

            <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="flex items-center">
                    <Select value={lang} onValueChange={handleLanguageChange}>
                        <SelectTrigger className="w-[120px] bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-800">
                            <LanguagesIcon className="mr-2 h-4 w-4 text-gray-600" />
                            <SelectValue placeholder="Lang" />
                        </SelectTrigger>
                        <SelectContent>
                            {Languages.map((l, i) => (
                                <SelectItem
                                    key={i}
                                    value={l}
                                    className="text-gray-700"
                                >
                                    {l}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    {isLoggedin() ? (
                        <Button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-all duration-200"
                        >
                            <LogOut className="w-4 h-4" />
                            {t(translationKey.button.logout)}
                        </Button>
                    ) : (
                        <Button onClick={handleRedirectToLogin}>
                            <LogIn className="w-4 h-4" />
                            {t(translationKey.button.signin)}
                        </Button>
                    )}
                </motion.div>
            </motion.div>
        </nav>
    );
}

export default Navbar;

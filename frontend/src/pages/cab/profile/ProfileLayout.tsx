import ProfileSidebar from "@/components/shared/profile/ProfileSidebar";
import { Car, User, Wallet } from "lucide-react";
import translationKey from "@/utils/i18n/translationKey";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Outlet } from "@tanstack/react-router";
import type { FileRoutesByTo } from "@/routeTree.gen";

function ProfileLayout() {
    const { t } = useTranslation();

    const tabs: Array<{
        label: string;
        icon: typeof User;
        route: keyof FileRoutesByTo;
    }> = [
        {
            label: t(translationKey.button.userDetails),
            icon: User,
            route: "/cab/profile",
        },
        {
            label: t(translationKey.button.cabDetails),
            icon: Car,
            route: "/cab/profile/cabDetails",
        },
        {
            label: t(translationKey.button.wallet),
            icon: Wallet,
            route: "/cab/profile/wallet",
        },
    ];

    return (
        <div className="h-full w-full bg-gray-50 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex bg-white rounded-[2rem] shadow-2xl shadow-black/10 overflow-hidden h-3/4 w-1/2 py-3"
            >
                <ProfileSidebar tabs={tabs} />
                <div className="flex-1 flex justify-center p-1 overflow-y-auto hide-scroll-bar">
                    <Outlet />
                </div>
            </motion.div>
        </div>
    );
}

export default ProfileLayout;

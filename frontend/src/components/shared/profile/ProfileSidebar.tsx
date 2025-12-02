import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { FileRoutesByTo } from "@/routeTree.gen";
import { Button } from "@/components/ui/button";

interface Tab {
    label: string;
    icon: LucideIcon;
    route: keyof FileRoutesByTo;
}

interface ProfileSidebarProps {
    tabs: Tab[];
}

export default function ProfileSidebar({ tabs }: ProfileSidebarProps) {
    const router = useRouterState();
    const currentPath = router.location.pathname;

    return (
        <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-64 border-r border-gray-200 flex-shrink-0"
        >
            <nav className="flex flex-col p-4 space-y-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    // Don't normalize trailing slash for root index ("/")
                    const normalizedCurrentPath =
                        currentPath.length > 1 && currentPath.endsWith("/")
                            ? currentPath.slice(0, -1)
                            : currentPath;
                    const normalizedTabRoute =
                        tab.route.length > 1 && tab.route.endsWith("/")
                            ? tab.route.slice(0, -1)
                            : tab.route;

                    // Mark active if route matches exactly only
                    const isActive =
                        normalizedCurrentPath === normalizedTabRoute;

                    return (
                        <motion.div
                            key={tab.route}
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Link to={tab.route} className="w-full">
                                <Button
                                    variant={isActive ? "default" : "ghost"}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors justify-start ${
                                        isActive
                                            ? "bg-black text-white"
                                            : "text-black hover:bg-gray-100"
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{tab.label}</span>
                                </Button>
                            </Link>
                        </motion.div>
                    );
                })}
            </nav>
        </motion.div>
    );
}

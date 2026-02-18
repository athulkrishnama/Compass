import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
    LogIn,
    LogOut,
    Users,
    Percent,
    Building2,
    Hotel,
    IndianRupee,
} from "lucide-react";
import { createOverallDashboardQueryOptions } from "@/queryOptions/dashboardQueryOptions";
import PropertyTable from "@/components/hotel/dashboard/PropertyTable";
import translationKey from "@/utils/i18n/translationKey";

const t_keys = translationKey.dashboard;

function StatCard({
    icon: Icon,
    label,
    value,
    suffix,
    index,
}: {
    icon: React.ElementType;
    label: string;
    value: number | string;
    suffix?: string;
    index: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="bg-white border border-neutral-200 rounded-xl p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="p-2.5 bg-neutral-100 rounded-lg">
                <Icon className="w-5 h-5 text-neutral-700" />
            </div>
            <div>
                <p className="text-sm text-neutral-500 mb-0.5">{label}</p>
                <p className="text-2xl font-semibold text-neutral-900">
                    {value}
                    {suffix && (
                        <span className="text-base font-normal text-neutral-400 ml-0.5">
                            {suffix}
                        </span>
                    )}
                </p>
            </div>
        </motion.div>
    );
}

export default function OverallDashboard() {
    const { t } = useTranslation();
    const { data, isLoading } = useQuery(createOverallDashboardQueryOptions());

    const dashboard = data?.data;

    if (isLoading) {
        return (
            <div className="p-6 space-y-6">
                <div className="h-8 w-64 bg-neutral-200 rounded animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-24 bg-neutral-100 rounded-xl animate-pulse"
                        />
                    ))}
                </div>
                <div className="h-64 bg-neutral-100 rounded-xl animate-pulse" />
            </div>
        );
    }

    if (!dashboard) return null;

    const stats = [
        {
            icon: LogIn,
            label: t(t_keys.todayCheckIns),
            value: dashboard.todayCheckIns,
        },
        {
            icon: LogOut,
            label: t(t_keys.todayCheckOuts),
            value: dashboard.todayCheckOuts,
        },
        {
            icon: Users,
            label: t(t_keys.activeGuests),
            value: dashboard.activeGuests,
        },
        {
            icon: Percent,
            label: t(t_keys.occupancyRate),
            value: dashboard.occupancyRate,
            suffix: "%",
        },
        {
            icon: Building2,
            label: t(t_keys.totalRooms),
            value: `${dashboard.occupiedRooms}/${dashboard.totalRooms}`,
        },
        {
            icon: IndianRupee,
            label: t(t_keys.totalRevenue),
            value: `₹${dashboard.totalRevenue.toLocaleString()}`,
        },
    ];

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold text-neutral-900"
            >
                {t(t_keys.overallTitle)}
            </motion.h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.map((stat, i) => (
                    <StatCard key={stat.label} index={i} {...stat} />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
            >
                <div className="mb-3">
                    <h2 className="text-lg font-semibold text-neutral-900">
                        {t(t_keys.yourProperties)}
                    </h2>
                </div>

                {dashboard.hotels.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-neutral-200 rounded-xl">
                        <Hotel className="w-12 h-12 text-neutral-300 mb-3" />
                        <p className="text-neutral-500 font-medium">
                            {t(t_keys.noHotels)}
                        </p>
                        <p className="text-sm text-neutral-400 mt-1 max-w-xs">
                            {t(t_keys.noHotelsDescription)}
                        </p>
                    </div>
                ) : (
                    <PropertyTable hotels={dashboard.hotels} />
                )}
            </motion.div>
        </div>
    );
}

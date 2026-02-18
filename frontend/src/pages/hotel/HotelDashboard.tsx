import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
    LogIn,
    LogOut,
    Users,
    Percent,
    DollarSign,
    Building2,
    CalendarCheck,
    ArrowLeft,
    IndianRupee,
} from "lucide-react";
import { createHotelDashboardQueryOptions } from "@/queryOptions/dashboardQueryOptions";
import RecentBookingsTable from "@/components/hotel/dashboard/RecentBookingsTable";
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

export default function HotelDashboard() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { hotelId } = useParams({ from: "/hotel/dashboard/$hotelId" });
    const { data, isLoading } = useQuery(
        createHotelDashboardQueryOptions(hotelId)
    );

    const dashboard = data?.data;

    if (isLoading) {
        return (
            <div className="p-6 space-y-6">
                <div className="h-8 w-48 bg-neutral-200 rounded animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-24 bg-neutral-100 rounded-xl animate-pulse"
                        />
                    ))}
                </div>
                <div className="h-72 bg-neutral-100 rounded-xl animate-pulse" />
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
        {
            icon: CalendarCheck,
            label: t(t_keys.totalBookings),
            value: dashboard.totalBookings,
        },
    ];

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate({ to: "/hotel" })}
                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-neutral-600" />
                </button>
                <div className="flex items-center gap-3">
                    <img
                        src={dashboard.hotel.coverImage}
                        alt={dashboard.hotel.name}
                        className="w-12 h-12 rounded-xl object-cover border border-neutral-200"
                    />
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-2xl font-bold text-neutral-900"
                        >
                            {dashboard.hotel.name}
                        </motion.h1>
                        <p className="text-sm text-neutral-500">
                            {dashboard.hotel.city}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <StatCard key={stat.label} index={i} {...stat} />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.3 }}
            >
                <div className="mb-3">
                    <h2 className="text-lg font-semibold text-neutral-900">
                        {t(t_keys.recentBookings)}
                    </h2>
                </div>

                {dashboard.recentBookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-neutral-200 rounded-xl">
                        <CalendarCheck className="w-12 h-12 text-neutral-300 mb-3" />
                        <p className="text-neutral-500">
                            {t(t_keys.noRecentBookings)}
                        </p>
                    </div>
                ) : (
                    <RecentBookingsTable bookings={dashboard.recentBookings} />
                )}
            </motion.div>
        </div>
    );
}

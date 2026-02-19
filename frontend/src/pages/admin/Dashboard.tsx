import React, { useState } from "react";
import StatsCards from "@/components/admin/dashboard/StatsCards";
import DashboardCharts from "@/components/admin/dashboard/DashboardCharts";
import { useQuery } from "@tanstack/react-query";
import type { DashboardFilter } from "@/types/admin/dashboard.types"; // Updated import path context
import { createGetAdminDashboardStatsQueryOption } from "@/queryOptions/adminDashboardQueryOptions";

const AdminDashboard: React.FC = () => {
    const [filter, setFilter] = useState<DashboardFilter>({
        type: "weekly",
        year: new Date().getFullYear(),
    });

    const {
        data: stats,
        isLoading,
        error,
    } = useQuery(createGetAdminDashboardStatsQueryOption(filter));

    const handleFilterChange = (
        type: "weekly" | "monthly" | "yearly",
        selectedYear?: number
    ) => {
        setFilter((prev) => ({
            ...prev,
            type,
            year: selectedYear || prev.year,
        }));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-12 text-red-500">
                Failed to load dashboard statistics.
            </div>
        );
    }

    return (
        <div className="p-6 max-w-[1600px] mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">
                    Admin Dashboard
                </h1>
                <p className="text-gray-500">
                    Welcome back! Here's what's happening today.
                </p>
            </div>

            {stats && (
                <>
                    <StatsCards stats={stats.cards} />
                    <DashboardCharts
                        chartsData={stats.charts}
                        onFilterChange={handleFilterChange}
                    />
                </>
            )}
        </div>
    );
};

export default AdminDashboard;

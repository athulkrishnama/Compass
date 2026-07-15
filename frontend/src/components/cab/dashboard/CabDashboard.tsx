import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ICabDashboardFilter } from "@/types/cab/dashboard.types";
import { createGetCabDashboardStatsQueryOptions } from "@/queryOptions/cabQueryOptions";
import CabStatsCards from "./CabStatsCards";
import CabDashboardCharts from "./CabDashboardCharts";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import Loading from "@/components/shared/loading/Loading";

export const CabDashboard: React.FC = () => {
    const { t } = useTranslation();
    const [filter, setFilter] = useState<ICabDashboardFilter>({
        type: "weekly",
        year: new Date().getFullYear(),
    });

    const {
        data: statsResponse,
        isLoading,
        error,
    } = useQuery(createGetCabDashboardStatsQueryOptions(filter));

    const handleFilterChange = (
        type: "weekly" | "monthly" | "yearly",
        selectedYear?: number,
        selectedMonth?: number
    ) => {
        setFilter((prev) => ({
            ...prev,
            type,
            year: selectedYear || prev.year,
            month: selectedMonth,
        }));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12 h-screen bg-gray-50 dark:bg-gray-900">
                <Loading />
            </div>
        );
    }

    if (error || !statsResponse?.data) {
        return (
            <div className="flex items-center justify-center p-12 h-screen text-red-500 bg-gray-50 dark:bg-gray-900">
                {t(translationKey.cabDashboard.failedToLoad)}
            </div>
        );
    }

    const stats = statsResponse.data;

    return (
        <div className="p-6 max-w-[1600px] mx-auto min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">
                    {t(translationKey.cabDashboard.title)}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    {t(translationKey.cabDashboard.subtitle)}
                </p>
            </div>

            <CabStatsCards stats={stats.cards} />

            <div className="mt-8">
                <CabDashboardCharts
                    chartsData={stats.charts}
                    onFilterChange={handleFilterChange}
                />
            </div>
        </div>
    );
};

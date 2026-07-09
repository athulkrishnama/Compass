import React, { useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend,
} from "recharts";
import { motion } from "framer-motion";
import type {
    IEarningsTrend,
    ITripStatusDistribution,
    IRatingDistribution,
} from "@/types/cab/dashboard.types";
import { Filter } from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface CabDashboardChartsProps {
    chartsData: {
        earningsTrends: IEarningsTrend[];
        tripStatusDistribution: ITripStatusDistribution[];
        ratingDistribution: IRatingDistribution[];
    };
    onFilterChange: (
        type: "weekly" | "monthly" | "yearly",
        year?: number,
        month?: number
    ) => void;
}

const COLORS = ["#000000", "#4B5563", "#9CA3AF", "#D1D5DB", "#F3F4F6"];
const DARK_COLORS = ["#FFFFFF", "#9CA3AF", "#6B7280", "#4B5563", "#374151"];

const CabDashboardCharts: React.FC<CabDashboardChartsProps> = ({
    chartsData,
    onFilterChange,
}) => {
    const { t } = useTranslation();
    const [filterType, setFilterType] = useState<
        "weekly" | "monthly" | "yearly"
    >("weekly");
    const [selectedYear] = useState<number>(new Date().getFullYear());
    const [selectedMonthStr, setSelectedMonthStr] = useState<string>(
        `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`
    );

    // Check if we are in dark mode (assuming a 'dark' class on HTML or body)
    const isDarkMode = document.documentElement.classList.contains("dark");
    const chartColors = isDarkMode ? DARK_COLORS : COLORS;

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const type = e.target.value as "weekly" | "monthly" | "yearly";
        setFilterType(type);
        if (type === "monthly") {
            const [y, m] = selectedMonthStr.split("-");
            onFilterChange(type, parseInt(y), parseInt(m));
        } else {
            onFilterChange(type, selectedYear);
        }
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value; // format YYYY-MM
        if (val) {
            setSelectedMonthStr(val);
            const [y, m] = val.split("-");
            onFilterChange(filterType, parseInt(y), parseInt(m));
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Earnings Trends Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="col-span-1 lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {t(translationKey.cabDashboard.earningsOverview)}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {t(
                                translationKey.cabDashboard.earningsOverviewDesc
                            )}
                        </p>
                    </div>
                    <div className="flex items-center gap-3 mt-4 sm:mt-0 bg-gray-50 dark:bg-gray-900 p-2 rounded-xl border border-gray-200 dark:border-gray-700">
                        <Filter size={16} className="text-gray-500" />
                        <select
                            value={filterType}
                            onChange={handleTypeChange}
                            className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer dark:text-gray-200"
                        >
                            <option value="weekly">
                                {t(translationKey.cabDashboard.thisWeek)}
                            </option>
                            <option value="monthly">
                                {t(translationKey.cabDashboard.thisYear)}
                            </option>
                            <option value="yearly">
                                {t(translationKey.cabDashboard.last5Years)}
                            </option>
                        </select>
                        {filterType === "monthly" && (
                            <input
                                type="month"
                                value={selectedMonthStr}
                                onChange={handleMonthChange}
                                className="bg-transparent text-sm font-medium focus:outline-none border-l border-gray-300 dark:border-gray-600 pl-3 cursor-pointer dark:text-gray-200"
                            />
                        )}
                    </div>
                </div>

                <div className="h-[350px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartsData.earningsTrends}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient
                                    id="colorEarnings"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor={chartColors[0]}
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor={chartColors[0]}
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke={isDarkMode ? "#374151" : "#E5E7EB"}
                            />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: isDarkMode ? "#9CA3AF" : "#6B7280",
                                    fontSize: 12,
                                }}
                                dy={10}
                                label={{
                                    value:
                                        filterType === "weekly"
                                            ? t(
                                                  translationKey.cabDashboard
                                                      .thisWeek
                                              )
                                            : filterType === "monthly"
                                              ? "Date"
                                              : "Year",
                                    position: "insideBottom",
                                    offset: -10,
                                    fill: isDarkMode ? "#9CA3AF" : "#6B7280",
                                    fontSize: 12,
                                }}
                            />
                            <YAxis
                                yAxisId="left"
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: isDarkMode ? "#9CA3AF" : "#6B7280",
                                    fontSize: 12,
                                }}
                                tickFormatter={(value) => `₹${value}`}
                                label={{
                                    value: "Earnings",
                                    angle: -90,
                                    position: "insideLeft",
                                    fill: isDarkMode ? "#9CA3AF" : "#6B7280",
                                    fontSize: 12,
                                }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: isDarkMode ? "#9CA3AF" : "#6B7280",
                                    fontSize: 12,
                                }}
                                label={{
                                    value: "Trips",
                                    angle: 90,
                                    position: "insideRight",
                                    fill: isDarkMode ? "#9CA3AF" : "#6B7280",
                                    fontSize: 12,
                                }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: isDarkMode
                                        ? "#1F2937"
                                        : "#FFFFFF",
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow:
                                        "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                    color: isDarkMode ? "#F9FAFB" : "#111827",
                                }}
                            />
                            <Legend wrapperStyle={{ paddingTop: "20px" }} />
                            <Area
                                yAxisId="left"
                                type="monotone"
                                dataKey="earnings"
                                name="Earnings (₹)"
                                stroke={chartColors[0]}
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorEarnings)"
                                activeDot={{
                                    r: 6,
                                    fill: chartColors[0],
                                    stroke: isDarkMode ? "#1F2937" : "#FFFFFF",
                                    strokeWidth: 2,
                                }}
                            />
                            <Area
                                yAxisId="right"
                                type="monotone"
                                dataKey="trips"
                                name="Trips"
                                stroke={chartColors[2]}
                                strokeWidth={2}
                                fill="transparent"
                                strokeDasharray="5 5"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Trip Status Distribution */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {t(translationKey.cabDashboard.tripStatus)}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    {t(translationKey.cabDashboard.tripStatusDesc)}
                </p>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartsData.tripStatusDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartsData.tripStatusDistribution.map(
                                    (_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={
                                                chartColors[
                                                    index % chartColors.length
                                                ]
                                            }
                                        />
                                    )
                                )}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: isDarkMode
                                        ? "#1F2937"
                                        : "#FFFFFF",
                                    borderRadius: "8px",
                                    border: "none",
                                    boxShadow:
                                        "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                    color: isDarkMode ? "#F9FAFB" : "#111827",
                                }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Rating Distribution */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {t(translationKey.cabDashboard.ratingDistribution)}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    {t(translationKey.cabDashboard.ratingDistributionDesc)}
                </p>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartsData.ratingDistribution}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                horizontal={true}
                                vertical={false}
                                stroke={isDarkMode ? "#374151" : "#E5E7EB"}
                            />
                            <XAxis
                                type="number"
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: isDarkMode ? "#9CA3AF" : "#6B7280",
                                    fontSize: 12,
                                }}
                            />
                            <YAxis
                                dataKey="name"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: isDarkMode ? "#9CA3AF" : "#6B7280",
                                    fontSize: 12,
                                }}
                            />
                            <Tooltip
                                cursor={{
                                    fill: isDarkMode ? "#374151" : "#F3F4F6",
                                }}
                                contentStyle={{
                                    backgroundColor: isDarkMode
                                        ? "#1F2937"
                                        : "#FFFFFF",
                                    borderRadius: "8px",
                                    border: "none",
                                    boxShadow:
                                        "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                    color: isDarkMode ? "#F9FAFB" : "#111827",
                                }}
                            />
                            <Bar
                                dataKey="value"
                                name="Number of Ratings"
                                fill={chartColors[0]}
                                radius={[0, 4, 4, 0]}
                                barSize={24}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </div>
    );
};

export default CabDashboardCharts;

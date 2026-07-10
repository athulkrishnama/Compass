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
import { Filter } from "lucide-react";

interface HotelDashboardChartsProps {
    chartsData: {
        revenueTrends: { name: string; revenue: number; bookings: number }[];
        bookingStatusDistribution: { name: string; value: number }[];
        topHotelsByBookings: { name: string; bookings: number }[];
    };
    onFilterChange: (
        type: "weekly" | "monthly" | "yearly",
        year?: number,
        month?: number
    ) => void;
}

const COLORS = ["#000000", "#4B5563", "#9CA3AF", "#D1D5DB", "#F3F4F6"];
const DARK_COLORS = ["#FFFFFF", "#9CA3AF", "#6B7280", "#4B5563", "#374151"];

const HotelDashboardCharts: React.FC<HotelDashboardChartsProps> = ({
    chartsData,
    onFilterChange,
}) => {
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
            {/* Revenue Trends Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="col-span-1 lg:col-span-2 bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700"
            >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                            Revenue Overview
                        </h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Track your revenue and bookings over time
                        </p>
                    </div>
                    <div className="flex items-center gap-3 mt-4 sm:mt-0 bg-neutral-50 dark:bg-neutral-900 p-2 rounded-xl border border-neutral-200 dark:border-neutral-700">
                        <Filter size={16} className="text-neutral-500" />
                        <select
                            value={filterType}
                            onChange={handleTypeChange}
                            className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer dark:text-neutral-200"
                        >
                            <option value="weekly">This Week</option>
                            <option value="monthly">This Year</option>
                            <option value="yearly">Last 5 Years</option>
                        </select>
                        {filterType === "monthly" && (
                            <input
                                type="month"
                                value={selectedMonthStr}
                                onChange={handleMonthChange}
                                className="bg-transparent text-sm font-medium focus:outline-none border-l border-neutral-300 dark:border-neutral-600 pl-3 cursor-pointer dark:text-neutral-200"
                            />
                        )}
                    </div>
                </div>

                <div className="h-[350px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartsData.revenueTrends}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient
                                    id="colorRevenue"
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
                                            ? "This Week"
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
                                    value: "Revenue",
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
                                    value: "Bookings",
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
                                dataKey="revenue"
                                name="Revenue (₹)"
                                stroke={chartColors[0]}
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
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
                                dataKey="bookings"
                                name="Bookings"
                                stroke={chartColors[2]}
                                strokeWidth={2}
                                fill="transparent"
                                strokeDasharray="5 5"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Booking Status Distribution */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700"
            >
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    Booking Status
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                    Distribution of current bookings
                </p>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartsData.bookingStatusDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartsData.bookingStatusDistribution.map(
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

            {/* Top Hotels By Bookings */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700"
            >
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    Top Hotels
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                    Hotels with the most bookings
                </p>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartsData.topHotelsByBookings}
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
                                dataKey="bookings"
                                name="Bookings"
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

export default HotelDashboardCharts;

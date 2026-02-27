import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import translationKeys from "@/utils/i18n/translationKey";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

interface DashboardChartsProps {
    chartsData: {
        bookingTrends: { name: string; bookings: number; revenue: number }[];
        topHotels: { name: string; bookings: number }[];
        bookingStatusDistribution: { name: string; value: number }[];
    };
    onFilterChange: (
        type: "weekly" | "monthly" | "yearly",
        year?: number
    ) => void;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const DashboardCharts: React.FC<DashboardChartsProps> = ({
    chartsData,
    onFilterChange,
}) => {
    const { t } = useTranslation();
    const [filterType, setFilterType] = useState<
        "weekly" | "monthly" | "yearly"
    >("weekly");
    const [year, setYear] = useState<number>(new Date().getFullYear());

    const handleFilterChange = (
        type: "weekly" | "monthly" | "yearly",
        newYear?: number
    ) => {
        setFilterType(type);
        if (newYear) setYear(newYear);
        onFilterChange(type, newYear || year);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-1 lg:col-span-2">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 md:mb-0">
                        Revenue & Booking Analytics
                    </h3>
                    <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-lg border border-gray-200">
                        {(["weekly", "monthly", "yearly"] as const).map(
                            (type) => (
                                <button
                                    key={type}
                                    onClick={() => handleFilterChange(type)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 capitalize ${
                                        filterType === type
                                            ? "bg-white text-blue-600 shadow-sm border border-gray-200"
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    {type}
                                </button>
                            )
                        )}
                    </div>
                </div>
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartsData.bookingTrends}
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
                                        stopColor="#8884d8"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="#8884d8"
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                                <linearGradient
                                    id="colorBookings"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="#82ca9d"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="#82ca9d"
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                yAxisId="left"
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                axisLine={false}
                                tickLine={false}
                            />
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    borderRadius: "8px",
                                    border: "none",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                }}
                            />
                            <Area
                                yAxisId="left"
                                type="monotone"
                                dataKey="revenue"
                                stroke="#8884d8"
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                                name="Revenue"
                            />
                            <Area
                                yAxisId="right"
                                type="monotone"
                                dataKey="bookings"
                                stroke="#82ca9d"
                                fillOpacity={1}
                                fill="url(#colorBookings)"
                                name="Bookings"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6">
                    Top Performing Hotels
                </h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartsData.topHotels}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                        >
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                width={100}
                                tick={{ fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                cursor={{ fill: "transparent" }}
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    borderRadius: "8px",
                                    border: "none",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                }}
                            />
                            <Bar
                                dataKey="bookings"
                                fill="#8884d8"
                                radius={[0, 4, 4, 0]}
                            >
                                {chartsData.topHotels.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6">
                    {t(translationKeys.dashboard.bookingStatusOverview)}
                </h3>
                <div className="h-[300px] flex justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartsData.bookingStatusDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartsData.bookingStatusDistribution.map(
                                    (_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    )
                                )}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;

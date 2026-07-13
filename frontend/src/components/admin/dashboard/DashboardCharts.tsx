import React, { useState } from "react";
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
import { type DashboardCharts as DashboardChartsData } from "@/types/admin/dashboard.types";

interface DashboardChartsProps {
    chartsData: DashboardChartsData;
    onFilterChange: (
        type: "weekly" | "monthly" | "yearly",
        year?: number
    ) => void;
}

const COLORS = ["#000000", "#4B5563", "#9CA3AF", "#D1D5DB"];
const PRIMARY_COLOR = "#000000";
const SECONDARY_COLOR = "#9CA3AF";

const DashboardCharts: React.FC<DashboardChartsProps> = ({
    chartsData,
    onFilterChange,
}) => {
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
            <div className="col-span-1 lg:col-span-2 flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">
                    Analytics Overview
                </h3>
                <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-lg border border-gray-200">
                    {(["weekly", "monthly", "yearly"] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => handleFilterChange(type)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 capitalize ${
                                filterType === type
                                    ? "bg-white text-black shadow-sm border border-gray-200"
                                    : "text-gray-500 hover:text-black"
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Hotel Trends */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6">
                    Hotel Revenue & Bookings
                </h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartsData.bookingTrends}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient
                                    id="colorHotelRevenue"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor={PRIMARY_COLOR}
                                        stopOpacity={0.4}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor={PRIMARY_COLOR}
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                                <linearGradient
                                    id="colorHotelBookings"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor={SECONDARY_COLOR}
                                        stopOpacity={0.4}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor={SECONDARY_COLOR}
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: "#6B7280" }}
                                minTickGap={10}
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
                                stroke="#E5E7EB"
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    borderRadius: "8px",
                                    border: "1px solid #E5E7EB",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                                }}
                            />
                            <Area
                                yAxisId="left"
                                type="monotone"
                                dataKey="revenue"
                                stroke={PRIMARY_COLOR}
                                fillOpacity={1}
                                fill="url(#colorHotelRevenue)"
                                name="Revenue"
                            />
                            <Area
                                yAxisId="right"
                                type="monotone"
                                dataKey="bookings"
                                stroke={SECONDARY_COLOR}
                                fillOpacity={1}
                                fill="url(#colorHotelBookings)"
                                name="Bookings"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Cab Trends */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6">
                    Cab Earnings & Trips
                </h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartsData.cabRideTrends}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient
                                    id="colorCabEarnings"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor={PRIMARY_COLOR}
                                        stopOpacity={0.4}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor={PRIMARY_COLOR}
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                                <linearGradient
                                    id="colorCabTrips"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor={SECONDARY_COLOR}
                                        stopOpacity={0.4}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor={SECONDARY_COLOR}
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: "#6B7280" }}
                                minTickGap={10}
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
                                stroke="#E5E7EB"
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    borderRadius: "8px",
                                    border: "1px solid #E5E7EB",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                                }}
                            />
                            <Area
                                yAxisId="left"
                                type="monotone"
                                dataKey="earnings"
                                stroke={PRIMARY_COLOR}
                                fillOpacity={1}
                                fill="url(#colorCabEarnings)"
                                name="Earnings"
                            />
                            <Area
                                yAxisId="right"
                                type="monotone"
                                dataKey="trips"
                                stroke={SECONDARY_COLOR}
                                fillOpacity={1}
                                fill="url(#colorCabTrips)"
                                name="Trips"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Hotels */}
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
                                tick={{ fontSize: 12, fill: "#4B5563" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                cursor={{ fill: "#F3F4F6" }}
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    borderRadius: "8px",
                                    border: "1px solid #E5E7EB",
                                }}
                            />
                            <Bar dataKey="bookings" radius={[0, 4, 4, 0]}>
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

            {/* Cab Type Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6">
                    Cab Type Distribution
                </h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartsData.cabTypeDistribution}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                        >
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                width={100}
                                tick={{ fontSize: 12, fill: "#4B5563" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                cursor={{ fill: "#F3F4F6" }}
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    borderRadius: "8px",
                                    border: "1px solid #E5E7EB",
                                }}
                            />
                            <Bar
                                dataKey="value"
                                name="Trips"
                                radius={[0, 4, 4, 0]}
                            >
                                {chartsData.cabTypeDistribution?.map(
                                    (_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    )
                                )}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Hotel Booking Status */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6">
                    Hotel Booking Status
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
                            <Tooltip
                                contentStyle={{
                                    borderRadius: "8px",
                                    border: "1px solid #E5E7EB",
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                wrapperStyle={{
                                    fontSize: "12px",
                                    color: "#4B5563",
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Cab Ride Status */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6">
                    Cab Ride Status
                </h3>
                <div className="h-[300px] flex justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartsData.cabRideStatusDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartsData.cabRideStatusDistribution?.map(
                                    (_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    )
                                )}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    borderRadius: "8px",
                                    border: "1px solid #E5E7EB",
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                wrapperStyle={{
                                    fontSize: "12px",
                                    color: "#4B5563",
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;

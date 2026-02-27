import React from "react";
import { useTranslation } from "react-i18next";
import translationKeys from "@/utils/i18n/translationKey";
import { Users, Building2, Car, CalendarCheck, TrendingUp } from "lucide-react";

interface StatsCardsProps {
    stats: {
        totalUsers: number;
        totalHotels: number;
        totalCabs: number;
        totalBookings: number;
        totalRevenue: number;
    };
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
    const { t } = useTranslation();

    const cards = [
        {
            title: t(translationKeys.dashboard.totalUsers),
            value: stats.totalUsers,
            icon: Users,
            color: "bg-blue-500",
            textColor: "text-blue-500",
            bgColor: "bg-blue-50",
        },
        {
            title: t(translationKeys.dashboard.totalHotels),
            value: stats.totalHotels,
            icon: Building2,
            color: "bg-indigo-500",
            textColor: "text-indigo-500",
            bgColor: "bg-indigo-50",
        },
        {
            title: t(translationKeys.dashboard.totalCabs),
            value: stats.totalCabs,
            icon: Car,
            color: "bg-yellow-500",
            textColor: "text-yellow-500",
            bgColor: "bg-yellow-50",
        },
        {
            title: t(translationKeys.dashboard.totalBookings),
            value: stats.totalBookings,
            icon: CalendarCheck,
            color: "bg-green-500",
            textColor: "text-green-500",
            bgColor: "bg-green-50",
        },
        {
            title: t(translationKeys.dashboard.totalRevenue),
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            icon: TrendingUp,
            color: "bg-purple-500",
            textColor: "text-purple-500",
            bgColor: "bg-purple-50",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${card.bgColor}`}>
                            <card.icon
                                className={`w-6 h-6 ${card.textColor}`}
                            />
                        </div>
                        <span className="text-gray-400 text-sm font-medium">
                            {t(translationKeys.dashboard.overAll)}
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-1">
                        {card.value}
                    </h3>
                    <p className="text-gray-500 text-sm font-medium">
                        {card.title}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;

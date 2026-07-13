import React from "react";
import type { ICabDashboardCards } from "@/types/cab/dashboard.types";
import { motion, type Variants } from "framer-motion";
import {
    DollarSign,
    Route,
    Star,
    UserCheck,
    TrendingUp,
    Navigation,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface CabStatsCardsProps {
    stats: ICabDashboardCards;
}

const CabStatsCards: React.FC<CabStatsCardsProps> = ({ stats }) => {
    const { t } = useTranslation();
    const cardData = [
        {
            title: t(translationKey.cabDashboard.todayEarnings),
            value: `₹${stats.todayEarnings.toFixed(2)}`,
            icon: DollarSign,
            description: t(translationKey.cabDashboard.todayEarningsDesc),
            trend: "positive",
        },
        {
            title: t(translationKey.cabDashboard.todayTrips),
            value: stats.todayTrips.toString(),
            icon: Navigation,
            description: t(translationKey.cabDashboard.todayTripsDesc),
            trend: "neutral",
        },
        {
            title: t(translationKey.cabDashboard.totalEarnings),
            value: `₹${stats.totalEarnings.toFixed(2)}`,
            icon: TrendingUp,
            description: t(translationKey.cabDashboard.totalEarningsDesc),
            trend: "positive",
        },
        {
            title: t(translationKey.cabDashboard.totalDistance),
            value: `${(stats.totalDistance / 1000).toFixed(1)} km`,
            icon: Route,
            description: t(translationKey.cabDashboard.totalDistanceDesc),
            trend: "neutral",
        },
        {
            title: t(translationKey.cabDashboard.averageRating),
            value: stats.averageRating.toFixed(1),
            icon: Star,
            description: t(translationKey.cabDashboard.averageRatingDesc),
            trend: stats.averageRating >= 4 ? "positive" : "neutral",
        },
        {
            title: t(translationKey.cabDashboard.totalReviews),
            value: stats.totalReviews.toString(),
            icon: UserCheck,
            description: t(translationKey.cabDashboard.totalReviewsDesc),
            trend: "neutral",
        },
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
            },
        },
    };

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {cardData.map((card, index) => (
                <motion.div
                    key={index}
                    variants={itemVariants}
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {card.title}
                            </p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                                {card.value}
                            </h3>
                        </div>
                        <div
                            className={`p-3 rounded-xl ${
                                card.trend === "positive"
                                    ? "bg-black text-white dark:bg-white dark:text-black"
                                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                        >
                            <card.icon size={24} />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                        {card.description}
                    </p>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default CabStatsCards;

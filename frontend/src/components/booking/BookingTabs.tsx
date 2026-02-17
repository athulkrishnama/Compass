import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface BookingTabsProps {
    activeTab: "upcoming" | "past";
    onTabChange: (tab: "upcoming" | "past") => void;
}

export function BookingTabs({ activeTab, onTabChange }: BookingTabsProps) {
    const { t } = useTranslation();

    const tabs = [
        {
            id: "upcoming" as const,
            label: t(translationKey.bookingHistory.upcomingTab),
        },
        {
            id: "past" as const,
            label: t(translationKey.bookingHistory.pastBookingsTab),
        },
    ];

    return (
        <div className="flex gap-2 border-b border-border">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`relative px-6 py-3 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    {tab.label}
                    {activeTab === tab.id && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                            transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                            }}
                        />
                    )}
                </button>
            ))}
        </div>
    );
}

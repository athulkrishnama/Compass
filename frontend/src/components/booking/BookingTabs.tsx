import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface BookingTabsProps {
    activeTab: "upcoming" | "ongoing" | "past";
    onTabChange: (tab: "upcoming" | "ongoing" | "past") => void;
}

export function BookingTabs({ activeTab, onTabChange }: BookingTabsProps) {
    const { t } = useTranslation();

    const tabs = [
        {
            id: "upcoming" as const,
            label: t(translationKey.bookingHistory.upcomingTab),
        },
        {
            id: "ongoing" as const,
            label: t(translationKey.bookingHistory.ongoingTab),
        },
        {
            id: "past" as const,
            label: t(translationKey.bookingHistory.pastBookingsTab),
        },
    ];

    return (
        <div className="flex gap-2">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`relative px-6 py-2.5 text-xs font-semibold rounded-full transition-all duration-300 uppercase tracking-wider ${
                        activeTab === tab.id
                            ? "bg-foreground text-background"
                            : "bg-secondary/50 text-muted-foreground hover:bg-muted"
                    }`}
                >
                    {tab.label}
                    {activeTab === tab.id && (
                        <motion.div
                            layoutId="activeTabPill"
                            className="absolute inset-0 bg-foreground rounded-full -z-10"
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 30,
                            }}
                        />
                    )}
                </button>
            ))}
        </div>
    );
}

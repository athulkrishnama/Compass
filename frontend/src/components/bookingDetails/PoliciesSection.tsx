import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface PoliciesSectionProps {
    policies: {
        smokingAllowed: boolean;
        petsAllowed: boolean;
        checkInTime: string;
        checkOutTime: string;
    };
}

export function PoliciesSection({ policies }: PoliciesSectionProps) {
    const { t } = useTranslation();

    const policyItems = [
        {
            label: t(translationKey.bookingDetails.petsAllowed),
            value: policies.petsAllowed,
        },
        {
            label: t(translationKey.bookingDetails.smoking),
            value: policies.smokingAllowed,
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="rounded-2xl border border-border bg-background p-5 flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-300"
        >
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-foreground">
                    {t(translationKey.bookingDetails.policiesAndRules)}
                </h3>
                <ShieldCheck className="w-4 h-4 text-muted-foreground" />
            </div>

            <div className="space-y-4">
                {policyItems.map((item) => (
                    <div
                        key={item.label}
                        className="flex items-center justify-between"
                    >
                        <span className="text-sm text-foreground/80">
                            {item.label}
                        </span>
                        <span
                            className={`px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                                item.value
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-600"
                            }`}
                        >
                            {item.value
                                ? t(translationKey.bookingDetails.yes)
                                : t(translationKey.bookingDetails.no)}
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

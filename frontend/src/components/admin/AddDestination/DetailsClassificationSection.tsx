import { useTranslation } from "react-i18next";
import { Tag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import translationKey from "@/utils/i18n/translationKey";
import SectionCard from "./SectionCard";
import { DESTINATION_TYPES } from "@/constants/destinationConstants/destinationType";
import { ACTIVITY_TYPE } from "@/constants/destinationConstants/activityType";
import { MONTH } from "@/constants/destinationConstants/months";
import { destinationTypeIcons } from "@/constants/destinationConstants/destinationTypeIcons";
import { activityTypeIcons } from "@/constants/destinationConstants/activityTypeIcons";
import type { DestinationFormType } from "@/components/shared/validations/destinationSchema";

interface DetailsClassificationSectionProps {
    form: DestinationFormType;
}

function DetailsClassificationSection({
    form,
}: DetailsClassificationSectionProps) {
    const { t } = useTranslation();
    const {
        setValue,
        watch,
        formState: { errors },
    } = form;

    const destinationType = watch("destinationType");
    const activities = watch("activities") || [];
    const bestMonths = watch("bestMonths") || [];

    const toggleActivity = (activity: ACTIVITY_TYPE) => {
        const current = activities as ACTIVITY_TYPE[];
        if (current.includes(activity)) {
            setValue(
                "activities",
                current.filter((a) => a !== activity)
            );
        } else {
            setValue("activities", [...current, activity]);
        }
    };

    const toggleMonth = (month: MONTH) => {
        const current = bestMonths as MONTH[];
        if (current.includes(month)) {
            setValue(
                "bestMonths",
                current.filter((m) => m !== month)
            );
        } else {
            setValue("bestMonths", [...current, month]);
        }
    };

    return (
        <SectionCard
            icon={Tag}
            title={t(translationKey.sections.detailsAndClassification)}
        >
            <div className="space-y-6">
                <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">
                        {t(translationKey.form.destinationType)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {Object.values(DESTINATION_TYPES).map((type) => {
                            const Icon = destinationTypeIcons[type];
                            const isSelected = destinationType === type;
                            return (
                                <motion.button
                                    key={type}
                                    type="button"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() =>
                                        setValue("destinationType", type, {
                                            shouldValidate: true,
                                        })
                                    }
                                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 
                                        transition-colors min-w-[70px] ${
                                            isSelected
                                                ? "border-gray-900 bg-gray-900 text-white"
                                                : "border-gray-200 hover:border-gray-300 bg-white"
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-xs capitalize">
                                        {t(
                                            translationKey.destinationTypes[
                                                type
                                            ]
                                        )}
                                    </span>
                                </motion.button>
                            );
                        })}
                    </div>
                    {errors.destinationType && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-red-500"
                        >
                            {errors.destinationType.message}
                        </motion.p>
                    )}
                </div>

                <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">
                        {t(translationKey.form.activities)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <AnimatePresence>
                            {(activities as ACTIVITY_TYPE[]).map((activity) => {
                                const Icon = activityTypeIcons[activity];
                                return (
                                    <motion.span
                                        key={activity}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="flex items-center gap-1 px-3 py-1 bg-gray-900 text-white 
                                            rounded-full text-xs"
                                    >
                                        <Icon className="w-3 h-3" />
                                        {t(translationKey.activities[activity])}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleActivity(activity)
                                            }
                                            className="ml-1 hover:text-gray-300"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </motion.span>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                        {Object.values(ACTIVITY_TYPE)
                            .filter(
                                (a) =>
                                    !(activities as ACTIVITY_TYPE[]).includes(a)
                            )
                            .map((activity) => {
                                const Icon = activityTypeIcons[activity];
                                return (
                                    <button
                                        key={activity}
                                        type="button"
                                        onClick={() => toggleActivity(activity)}
                                        className="flex items-center gap-1 px-3 py-1 border border-gray-200 
                                            rounded-full text-xs hover:bg-gray-50 transition-colors"
                                    >
                                        <Icon className="w-3 h-3" />
                                        {t(translationKey.activities[activity])}
                                    </button>
                                );
                            })}
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">
                        {t(translationKey.form.bestMonthsToVisit)}
                    </p>
                    <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                        {Object.values(MONTH).map((month) => {
                            const isSelected = (bestMonths as MONTH[]).includes(
                                month
                            );
                            return (
                                <motion.button
                                    key={month}
                                    type="button"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => toggleMonth(month)}
                                    className={`py-2 px-1 rounded-lg text-xs font-medium transition-colors ${
                                        isSelected
                                            ? "bg-gray-900 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    {t(translationKey.months[month])}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </SectionCard>
    );
}

export default DetailsClassificationSection;

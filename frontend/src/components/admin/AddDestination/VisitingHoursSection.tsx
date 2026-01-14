import { useTranslation } from "react-i18next";
import { Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import translationKey from "@/utils/i18n/translationKey";
import SectionCard from "./SectionCard";
import { WEEKDAY } from "@/constants/destinationConstants/weekdays";
import type { DestinationFormType } from "@/components/shared/validations/destinationSchema";

interface VisitingHoursSectionProps {
    form: DestinationFormType;
}

function VisitingHoursSection({ form }: VisitingHoursSectionProps) {
    const { t } = useTranslation();
    const { register, setValue, watch } = form;

    const isAlwaysOpen = watch("isAlwaysOpen");
    const closedDays = watch("closedDays") || [];

    const toggleDay = (day: WEEKDAY) => {
        const current = closedDays as WEEKDAY[];
        if (current.includes(day)) {
            setValue(
                "closedDays",
                current.filter((d) => d !== day)
            );
        } else {
            setValue("closedDays", [...current, day]);
        }
    };

    return (
        <SectionCard
            icon={Clock}
            title={t(translationKey.sections.visitingHours)}
        >
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-700">
                            {t(translationKey.form.isAlwaysOpen)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            {t(translationKey.form.isAlwaysOpenHint)}
                        </p>
                    </div>
                    <motion.button
                        type="button"
                        onClick={() => setValue("isAlwaysOpen", !isAlwaysOpen)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                            isAlwaysOpen ? "bg-gray-900" : "bg-gray-300"
                        }`}
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.div
                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                            animate={{
                                left: isAlwaysOpen
                                    ? "calc(100% - 20px)"
                                    : "4px",
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                            }}
                        />
                    </motion.button>
                </div>

                <AnimatePresence>
                    {!isAlwaysOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-6 overflow-hidden"
                        >
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="openingTime">
                                        {t(translationKey.form.openingTime)}
                                    </Label>
                                    <Input
                                        id="openingTime"
                                        type="time"
                                        {...register("openingTime")}
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="closingTime">
                                        {t(translationKey.form.closingTime)}
                                    </Label>
                                    <Input
                                        id="closingTime"
                                        type="time"
                                        {...register("closingTime")}
                                        className="h-10"
                                    />
                                    {form.formState.errors.closingTime && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-sm text-red-500"
                                        >
                                            {
                                                form.formState.errors
                                                    .closingTime.message
                                            }
                                        </motion.p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-sm font-medium text-gray-700">
                                    {t(translationKey.form.closedDays)}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {Object.values(WEEKDAY).map((day) => {
                                        const isSelected = (
                                            closedDays as WEEKDAY[]
                                        ).includes(day);
                                        return (
                                            <motion.button
                                                key={day}
                                                type="button"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => toggleDay(day)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                    isSelected
                                                        ? "bg-gray-900 text-white"
                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                }`}
                                            >
                                                {t(
                                                    translationKey.weekdays[day]
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </SectionCard>
    );
}

export default VisitingHoursSection;

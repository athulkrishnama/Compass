import { useTranslation } from "react-i18next";
import { Accessibility } from "lucide-react";
import { motion } from "framer-motion";
import translationKey from "@/utils/i18n/translationKey";
import SectionCard from "./SectionCard";
import type { DestinationFormType } from "@/components/shared/validations/destinationSchema";

interface AccessibilitySectionProps {
    form: DestinationFormType;
}

function AccessibilitySection({ form }: AccessibilitySectionProps) {
    const { t } = useTranslation();
    const { setValue, watch } = form;

    const wheelchairAccessible = watch("wheelchairAccessible");

    return (
        <SectionCard
            icon={Accessibility}
            title={t(translationKey.sections.accessibility)}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-700">
                        {t(translationKey.form.wheelchairAccessible)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Enable if the destination is wheelchair accessible
                    </p>
                </div>
                <motion.button
                    type="button"
                    onClick={() =>
                        setValue("wheelchairAccessible", !wheelchairAccessible)
                    }
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                        wheelchairAccessible ? "bg-gray-900" : "bg-gray-300"
                    }`}
                    whileTap={{ scale: 0.95 }}
                >
                    <motion.div
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                        animate={{
                            left: wheelchairAccessible
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
        </SectionCard>
    );
}

export default AccessibilitySection;

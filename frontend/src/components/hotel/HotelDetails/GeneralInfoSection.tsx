import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import translationKey from "@/utils/i18n/translationKey";

interface GeneralInfoSectionProps {
    name: string;
    description: string;
}

function GeneralInfoSection({ name, description }: GeneralInfoSectionProps) {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
            <div className="flex items-center gap-2 mb-4">
                <Info className="w-4 h-4 text-gray-500" />
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {t(translationKey.sections.generalInformation)}
                </h2>
            </div>

            <div className="space-y-3">
                <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                        {t(translationKey.form.hotelName)}
                    </p>
                    <p className="text-base font-medium text-gray-900">
                        {name}
                    </p>
                </div>

                <div className="pt-2 border-t border-gray-50">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                        {t(translationKey.form.description)}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

export default GeneralInfoSection;

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface DestinationDescriptionProps {
    description: string;
}

function DestinationDescription({ description }: DestinationDescriptionProps) {
    const { t } = useTranslation();

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t(translationKey.destinationDetail.theExperience)}
            </h2>
            <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {description}
                </p>
            </div>
        </motion.section>
    );
}

export default DestinationDescription;

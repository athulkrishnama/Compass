import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { CheckCircle2, MapPin } from "lucide-react";
import translationKey from "@/utils/i18n/translationKey";

function NoMoreDestinations() {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-8 flex flex-col items-center justify-center gap-3"
        >
            <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-5 h-5" />
                <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-sm text-gray-500 uppercase tracking-wider">
                {t(translationKey.text.noMoreDestinations)}
            </p>
        </motion.div>
    );
}

export default NoMoreDestinations;

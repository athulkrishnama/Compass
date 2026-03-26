import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

const CabHomeHeader = () => {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <p className="text-xs font-semibold tracking-widest text-zinc-400 uppercase mb-1">
                {t(translationKey.cabHome.bookRide)}
            </p>
            <h1 className="text-3xl font-bold text-black leading-tight">
                {t(translationKey.cabHome.whereAreYouGoing)}
            </h1>
        </motion.div>
    );
};

export default CabHomeHeader;

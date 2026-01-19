import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import { MONTH } from "@/constants/destinationConstants/months";

interface DestinationBestTimeProps {
    bestMonths: MONTH[];
}

const ALL_MONTHS: MONTH[] = [
    MONTH.JANUARY,
    MONTH.FEBRUARY,
    MONTH.MARCH,
    MONTH.APRIL,
    MONTH.MAY,
    MONTH.JUNE,
    MONTH.JULY,
    MONTH.AUGUST,
    MONTH.SEPTEMBER,
    MONTH.OCTOBER,
    MONTH.NOVEMBER,
    MONTH.DECEMBER,
];

function DestinationBestTime({ bestMonths }: DestinationBestTimeProps) {
    const { t } = useTranslation();

    const getMonthAbbreviation = (month: MONTH) => {
        const fullMonth = t(translationKey.months[month]);
        return fullMonth.substring(0, 3).toUpperCase();
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
        >
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">
                {t(translationKey.destinationDetail.bestTimeToVisit)}
            </h2>

            <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                {ALL_MONTHS.map((month, index) => {
                    const isBest = bestMonths.includes(month);
                    return (
                        <motion.div
                            key={month}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * (index % 6) }}
                            className={`
                                relative py-3 px-2 rounded-xl text-center cursor-default transition-all
                                ${
                                    isBest
                                        ? "bg-gray-900 text-white shadow-lg"
                                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                }
                            `}
                        >
                            <span className="text-xs font-bold">
                                {getMonthAbbreviation(month)}
                            </span>
                        </motion.div>
                    );
                })}
            </div>

            <p className="text-xs text-gray-400 mt-4 italic">
                * {t(translationKey.destinationDetail.weatherNote)}
            </p>
        </motion.section>
    );
}

export default DestinationBestTime;

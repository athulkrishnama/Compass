import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { activityTypeIcons } from "@/constants/destinationConstants/activityTypeIcons";
import translationKey from "@/utils/i18n/translationKey";
import type { ACTIVITY_TYPE } from "@/constants/destinationConstants/activityType";

interface DestinationActivitiesProps {
    activities: ACTIVITY_TYPE[];
}

function DestinationActivities({ activities }: DestinationActivitiesProps) {
    const { t } = useTranslation();

    if (activities.length === 0) {
        return null;
    }

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
        >
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">
                {t(translationKey.destinationDetail.curatedActivities)}
            </h2>

            <div className="flex flex-wrap gap-3">
                {activities.map((activity, index) => {
                    const ActivityIcon = activityTypeIcons[activity];
                    return (
                        <motion.div
                            key={activity}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-full"
                        >
                            {ActivityIcon && (
                                <ActivityIcon className="w-4 h-4" />
                            )}
                            <span className="text-sm font-medium">
                                {t(translationKey.activities[activity])}
                            </span>
                        </motion.div>
                    );
                })}
            </div>
        </motion.section>
    );
}

export default DestinationActivities;

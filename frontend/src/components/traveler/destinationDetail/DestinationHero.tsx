import { motion } from "framer-motion";
import { ImageOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { destinationTypeIcons } from "@/constants/destinationConstants/destinationTypeIcons";
import translationKey from "@/utils/i18n/translationKey";
import type { ACTIVITY_TYPE } from "@/constants/destinationConstants/activityType";
import type { DESTINATION_TYPES } from "@/constants/destinationConstants/destinationType";

interface DestinationHeroProps {
    coverImage: string;
    name: string;
    tagline: string;
    type: DESTINATION_TYPES;
    activities: ACTIVITY_TYPE[];
}

function DestinationHero({
    coverImage,
    name,
    tagline,
    type,
    activities,
}: DestinationHeroProps) {
    const { t } = useTranslation();
    const TypeIcon = destinationTypeIcons[type];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-3xl overflow-hidden"
        >
            <div className="relative h-[350px] md:h-[450px]">
                {coverImage ? (
                    <img
                        src={coverImage}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <ImageOff className="w-20 h-20 text-gray-400" />
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute top-6 left-6 flex items-center gap-2">
                    <Badge className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-gray-900/80 text-white border-0 backdrop-blur-sm">
                        {t(translationKey.destinationTypes[type])}
                    </Badge>
                    {activities.slice(0, 1).map((activity) => (
                        <Badge
                            key={activity}
                            className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-gray-900/80 text-white border-0 backdrop-blur-sm"
                        >
                            {t(translationKey.activities[activity])}
                        </Badge>
                    ))}
                </div>

                {TypeIcon && (
                    <div className="absolute top-6 right-6 p-3 bg-white/90 rounded-full backdrop-blur-sm">
                        <TypeIcon className="w-5 h-5 text-gray-800" />
                    </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3"
                        style={{ fontFamily: "Georgia, serif" }}
                    >
                        {name}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg md:text-xl text-white/90 max-w-2xl"
                    >
                        {tagline}
                    </motion.p>
                </div>
            </div>
        </motion.div>
    );
}

export default DestinationHero;

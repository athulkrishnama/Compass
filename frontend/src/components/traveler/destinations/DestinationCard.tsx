import { motion } from "framer-motion";
import { ImageOff, MapPin, Accessibility } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { activityTypeIcons } from "@/constants/destinationConstants/activityTypeIcons";
import { destinationTypeIcons } from "@/constants/destinationConstants/destinationTypeIcons";
import translationKey from "@/utils/i18n/translationKey";
import type { ACTIVITY_TYPE } from "@/constants/destinationConstants/activityType";
import type { DESTINATION_TYPES } from "@/constants/destinationConstants/destinationType";

export interface DestinationCardProps {
    id: string;
    name: string;
    tagline: string;
    coverImage: string;
    type: DESTINATION_TYPES;
    activities: ACTIVITY_TYPE[];
    city: string;
    isFree: boolean;
    entryFee: number;
    isActive: boolean;
    isWheelChairAccessible: boolean;
}

function DestinationCard({
    id,
    name,
    tagline,
    coverImage,
    type,
    activities,
    city,
    isFree,
    entryFee,
    isActive,
    isWheelChairAccessible,
}: DestinationCardProps) {
    const { t } = useTranslation();
    const TypeIcon = destinationTypeIcons[type];

    return (
        <Link to="/traveler/destination/$id" params={{ id }}>
            <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 h-full flex flex-col"
            >
                {/* Cover Image - Fixed height */}
                <div className="relative h-48 overflow-hidden flex-shrink-0">
                    {coverImage ? (
                        <img
                            src={coverImage}
                            alt={name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <ImageOff className="w-12 h-12 text-gray-400" />
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute top-3 left-3">
                        <Badge
                            variant="secondary"
                            className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                                isActive
                                    ? "bg-white/90 text-gray-900"
                                    : "bg-gray-800/90 text-white"
                            }`}
                        >
                            {isActive
                                ? t(translationKey.button.active)
                                : t(translationKey.text.inactive)}
                        </Badge>
                    </div>

                    {isWheelChairAccessible && (
                        <div className="absolute top-3 right-12 p-2 bg-white/90 rounded-full">
                            <Accessibility className="w-4 h-4 text-blue-600" />
                        </div>
                    )}

                    {TypeIcon && (
                        <div className="absolute top-3 right-3 p-2 bg-white/90 rounded-full">
                            <TypeIcon className="w-4 h-4 text-gray-700" />
                        </div>
                    )}
                </div>

                {/* Content - Flex grow */}
                <div className="p-4 flex flex-col flex-grow">
                    {/* Name and City */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900 truncate group-hover:text-gray-700 transition-colors flex-1">
                            {name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-gray-500 shrink-0">
                            <MapPin className="w-3 h-3" />
                            <span className="uppercase tracking-wide truncate max-w-[80px]">
                                {city}
                            </span>
                        </div>
                    </div>

                    {/* Tagline - Fixed 2 lines with ellipsis */}
                    <p className="text-sm text-gray-600 leading-relaxed flex-grow mb-3 overflow-hidden line-clamp-2">
                        {tagline}
                    </p>

                    {/* Activities and Price - Always at bottom */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
                        <div className="flex items-center gap-2 overflow-hidden">
                            {activities.slice(0, 2).map((activity) => {
                                const ActivityIcon =
                                    activityTypeIcons[activity];
                                return (
                                    <div
                                        key={activity}
                                        className="flex items-center gap-1.5 text-xs text-gray-500"
                                    >
                                        {ActivityIcon && (
                                            <ActivityIcon className="w-3.5 h-3.5 flex-shrink-0" />
                                        )}
                                        <span className="hidden sm:inline truncate max-w-[60px]">
                                            {t(
                                                translationKey.activities[
                                                    activity
                                                ]
                                            )}
                                        </span>
                                    </div>
                                );
                            })}
                            {activities.length > 2 && (
                                <span className="text-xs text-gray-400 flex-shrink-0">
                                    +{activities.length - 2}
                                </span>
                            )}
                        </div>

                        {isFree ? (
                            <Badge
                                variant="outline"
                                className="border-green-200 bg-green-50 text-green-700 font-medium flex-shrink-0"
                            >
                                {t(translationKey.text.free)}
                            </Badge>
                        ) : (
                            <span className="text-sm font-semibold text-gray-900 flex-shrink-0">
                                ₹{entryFee}
                            </span>
                        )}
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}

export default DestinationCard;

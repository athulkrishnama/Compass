import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import { Wifi } from "lucide-react";
import { getAmenityDetails } from "@/constants/roomConstants/roomAmenityWithIconAndTranslation";

interface RoomAmenitiesProps {
    amenities: string[];
}

export default function RoomAmenities({ amenities }: RoomAmenitiesProps) {
    const { t } = useTranslation();

    if (amenities.length === 0) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t(translationKey.roomDetails.roomAmenities)}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {amenities.map((amenity, index) => {
                    const amenityDetails = getAmenityDetails(amenity);
                    const Icon = amenityDetails?.icon || Wifi;
                    const label = amenityDetails
                        ? t(amenityDetails.labelKey)
                        : amenity.replace(/_/g, " ");

                    return (
                        <motion.div
                            key={amenity}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + index * 0.05 }}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <Icon className="w-4 h-4 text-gray-700" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                                {label}
                            </span>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

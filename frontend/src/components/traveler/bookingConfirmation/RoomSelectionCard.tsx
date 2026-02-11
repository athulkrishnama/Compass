import { motion } from "framer-motion";
import { Wifi, AirVent } from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface RoomSelectionCardProps {
    name: string;
    type: string;
    bedConfig: string;
    view: string;
    amenities: string[];
    image: string;
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1] as const,
        },
    },
};

export default function RoomSelectionCard({
    name,
    type,
    bedConfig,
    view,
    amenities,
    image,
}: RoomSelectionCardProps) {
    const { t } = useTranslation();
    return (
        <motion.div variants={itemVariants}>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                {t(translationKey.bookingConfirmation.roomSelection)}
            </h2>
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
                <div className="flex gap-3 sm:gap-4">
                    <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                            {name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                            {type} • {bedConfig} {view && `• ${view}`}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {amenities.slice(0, 4).map((amenity, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gray-50 rounded-full text-xs font-medium text-gray-600 border border-gray-100"
                                >
                                    {amenity === "FREE WIFI" && (
                                        <Wifi className="w-3 h-3" />
                                    )}
                                    {amenity === "AC" && (
                                        <AirVent className="w-3 h-3" />
                                    )}
                                    {amenity}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="w-24 h-20 sm:w-28 sm:h-24 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                            src={image}
                            alt={name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

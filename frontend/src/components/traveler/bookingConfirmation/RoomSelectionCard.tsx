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
            <h2 className="text-lg font-bold text-gray-900 mb-4">
                {t(translationKey.bookingConfirmation.roomSelection)}
            </h2>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            {type} • {bedConfig} • {view}
                        </p>
                        <div className="flex gap-2">
                            {amenities.map((amenity, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full text-xs font-medium text-gray-600 border border-gray-100"
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
                    <div className="w-28 h-24 rounded-xl overflow-hidden flex-shrink-0">
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

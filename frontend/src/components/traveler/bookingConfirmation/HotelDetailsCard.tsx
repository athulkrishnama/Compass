import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface HotelDetailsCardProps {
    name: string;
    address: string;
    description: string;
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

export default function HotelDetailsCard({
    name,
    address,
    description,
    image,
}: HotelDetailsCardProps) {
    const { t } = useTranslation();
    return (
        <motion.div variants={itemVariants}>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                {t(translationKey.bookingConfirmation.hotelDetails)}
            </h2>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="aspect-[16/9] sm:aspect-[16/8] overflow-hidden">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="p-4 sm:p-5">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                        {name}
                    </h3>
                    <div className="flex items-start gap-2 text-gray-500 mb-2 sm:mb-3">
                        <MapPin className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                        <p className="text-xs sm:text-sm">{address}</p>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">
                        {description}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

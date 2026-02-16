import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

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
    return (
        <motion.div variants={itemVariants}>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex gap-3 sm:gap-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                            src={image}
                            alt={name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                            {name}
                        </h3>
                        <div className="flex items-start gap-1.5 text-gray-500 mb-1">
                            <MapPin className="w-3.5 h-3.5 mt-0.5 text-green-600 flex-shrink-0" />
                            <p className="text-xs sm:text-sm line-clamp-1">
                                {address}
                            </p>
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-2">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

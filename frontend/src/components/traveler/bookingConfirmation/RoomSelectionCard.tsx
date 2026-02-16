import { motion } from "framer-motion";

interface RoomSelectionCardProps {
    name: string;
    type: string;
    bedConfig: string;
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
    amenities,
    image,
}: RoomSelectionCardProps) {
    return (
        <motion.div variants={itemVariants}>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex gap-3 sm:gap-4">
                    <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                            {name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mb-2">
                            {type} • {bedConfig}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {amenities.slice(0, 4).map((amenity, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-50 rounded text-xs font-medium text-gray-700 border border-gray-200"
                                >
                                    {amenity.toUpperCase().replace("FREE ", "")}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0">
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

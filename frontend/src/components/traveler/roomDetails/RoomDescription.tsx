import { motion } from "framer-motion";
import { Users, Bed, Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface RoomDescriptionProps {
    description: string;
    maxOccupancy: number;
    bedConfig: {
        type: string;
        count: number;
    };
}

export default function RoomDescription({
    description,
    maxOccupancy,
    bedConfig,
}: RoomDescriptionProps) {
    const { t } = useTranslation();

    const specs = [
        {
            icon: Users,
            label: t(translationKey.roomDetails.occupancy),
            value: t(translationKey.roomDetails.upToGuests, {
                count: maxOccupancy,
            }),
        },
        {
            icon: Bed,
            label: t(translationKey.roomDetails.bedType),
            value: t(translationKey.roomDetails.beds, {
                count: bedConfig.count,
                type: bedConfig.type,
            }),
        },
        {
            icon: Building2,
            label: t(translationKey.roomDetails.view),
            value: t(translationKey.roomDetails.cityView),
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t(translationKey.roomDetails.aboutTheRoom)}
            </h2>

            <p className="text-gray-600 leading-relaxed mb-6">{description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {specs.map((spec, index) => (
                    <motion.div
                        key={spec.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
                    >
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                            <spec.icon className="w-5 h-5 text-gray-700" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">
                                {spec.label}
                            </p>
                            <p className="font-medium text-gray-900">
                                {spec.value}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

import React from "react";
import { motion } from "framer-motion";
import type { VehicleType } from "@/types/vehicleType";
import { CAB_IMAGE_MAP } from "@/constants/cabConstants";

interface VehicleModelProps {
    vehicleType: VehicleType;
    modelName: string;
}

const VehicleModel: React.FC<VehicleModelProps> = ({
    vehicleType,
    modelName,
}) => {
    const Image = CAB_IMAGE_MAP[vehicleType];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center gap-4 bg-gray-100/80 rounded-2xl p-3 pr-8 w-fit">
                <div className="p-2 bg-gray-200/50 rounded-xl text-gray-600">
                    <img src={Image} alt={vehicleType} className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                    <span className="text-base font-bold capitalize text-gray-900 leading-none">
                        {vehicleType}
                    </span>
                    <span className="text-xs font-medium text-gray-500 mt-1">
                        {modelName}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default VehicleModel;

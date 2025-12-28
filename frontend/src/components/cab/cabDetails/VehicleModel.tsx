import React from "react";
import { motion } from "framer-motion";
import {
    Car,
    Truck,
    Bus,
    Bike,
    Gem,
    Rocket,
    Tractor,
    type LucideIcon,
} from "lucide-react";
import type { VehicleType } from "@/types/vehicleType";

interface VehicleModelProps {
    vehicleType: VehicleType;
    modelName: string;
}

const VEHICLE_ICONS: Record<VehicleType, LucideIcon> = {
    sedan: Car,
    hatchback: Car,
    van: Bus,
    jeep: Car,
    suv: Car,
    coupe: Car,
    convertible: Car,
    wagon: Car,
    pickup: Truck,
    minivan: Bus,
    truck: Truck,
    luxury: Gem,
    limousine: Gem,
    microcar: Car,
    roadster: Rocket,
    crossover: Car,
    offroad: Tractor,
    rickshaw: Bike,
};

const VehicleModel: React.FC<VehicleModelProps> = ({ vehicleType, modelName }) => {
    const Icon = VEHICLE_ICONS[vehicleType] || Car;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center gap-4 bg-gray-100/80 rounded-2xl p-3 pr-8 w-fit">
                <div className="p-2 bg-gray-200/50 rounded-xl text-gray-600">
                    <Icon className="w-6 h-6" strokeWidth={2} />
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

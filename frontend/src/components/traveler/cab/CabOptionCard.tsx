import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Car, User } from "lucide-react";
import {
    CAB_IMAGE_MAP,
    CAB_DESCRIPTIONS,
    CAB_CAPACITY,
} from "@/constants/cabConstants";
import type { FareOption } from "@/types/api/requests/fareRequests";

interface CabOptionCardProps {
    fare: FareOption;
    isSelected: boolean;
    onSelect: (cabType: string) => void;
    variants: Variants;
}

const CabOptionCard = ({
    fare,
    isSelected,
    onSelect,
    variants,
}: CabOptionCardProps) => {
    return (
        <motion.div
            variants={variants}
            onClick={() => onSelect(fare.cab_type)}
            className={`
                relative p-4 rounded-2xl cursor-pointer transition-all duration-300 m-2
                ${
                    isSelected
                        ? "ring-2 ring-black bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] scale-[1.02] z-10"
                        : "ring-1 ring-transparent bg-white hover:bg-gray-50 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
                }
            `}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-20 h-16 flex items-center justify-center -ml-2">
                        {CAB_IMAGE_MAP[fare.cab_type] ? (
                            <img
                                src={CAB_IMAGE_MAP[fare.cab_type]}
                                alt={fare.cab_type}
                                className="w-full h-full object-contain drop-shadow-md pb-1"
                            />
                        ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                <Car className="w-6 h-6 text-black" />
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center space-x-2">
                            <h3 className="font-bold text-lg leading-tight capitalize">
                                {fare.cab_type.toLowerCase()}
                            </h3>
                            <div className="flex items-center text-xs font-semibold bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">
                                <User className="w-3 h-3 mr-1" />
                                {CAB_CAPACITY[fare.cab_type] || 4}
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 font-medium">
                            {CAB_DESCRIPTIONS[fare.cab_type] || "Standard ride"}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-bold text-xl tracking-tight">
                        ₹{Math.ceil(fare.total_fare)}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default CabOptionCard;

import React from "react";
import { motion } from "framer-motion";
import { RectangleHorizontal } from "lucide-react";

interface RegistrationNumberProps {
    registrationNumber: string;
}

const RegistrationNumber: React.FC<RegistrationNumberProps> = ({
    registrationNumber,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div className="flex items-center gap-4 bg-gray-100/80 rounded-2xl p-3 pr-6 w-fit">
                <div className="p-2 bg-white rounded-xl shadow-sm text-gray-700">
                    <RectangleHorizontal className="w-6 h-6" />
                </div>
                <div className="font-mono text-lg font-bold tracking-wider text-gray-800">
                    {registrationNumber}
                </div>
            </div>
        </motion.div>
    );
};

export default RegistrationNumber;

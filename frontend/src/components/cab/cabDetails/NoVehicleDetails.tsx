import React from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface NoVehicleDetailsProps {
    onAddVehicle: () => void;
}

const NoVehicleDetails: React.FC<NoVehicleDetailsProps> = ({
    onAddVehicle,
}) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center p-10 text-center gap-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-100 rounded-full p-6"
            >
                <Plus className="w-12 h-12 text-gray-400" />
            </motion.div>
            <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold text-gray-900">
                    {t("text.noVehicleDetails", "No Vehicle Details Found")}
                </h3>
                <p className="text-gray-500 max-w-md">
                    {t(
                        "text.addVehicleDescription",
                        "Please add your vehicle details to start accepting rides."
                    )}
                </p>
            </div>
            <Button onClick={onAddVehicle} className="gap-2">
                <Plus className="w-4 h-4" />
                {t("button.addVehicle")}
            </Button>
        </div>
    );
};

export default NoVehicleDetails;

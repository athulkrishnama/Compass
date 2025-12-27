import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import UpdateBaseLocationModal from "./UpdateBaseLocationModal";

interface BaseLocationProps {
    baseLocation?: string;
    onLocationChange: (city: string, cordinates: [number, number]) => void;
}

const BaseLocation: React.FC<BaseLocationProps> = ({
    baseLocation,
    onLocationChange,
}) => {
    const { t } = useTranslation();
    const displayLocation = baseLocation || t("text.notSet");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full flex items-center justify-between py-2"
            >
                <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-black fill-white" />
                    <span className="text-base font-medium text-gray-800">
                        {t("text.baseLocation")}: {displayLocation}
                    </span>
                </div>

                <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleOpenModal}
                    className="rounded-full bg-gray-200 hover:bg-gray-300 text-black font-semibold px-4 text-xs uppercase tracking-wide flex items-center gap-2"
                >
                    {t("button.changeBaseLocation", "CHANGE BASE LOCATION")}
                    <Pencil className="w-3 h-3" />
                </Button>
            </motion.div>

            <UpdateBaseLocationModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                onLocationChange={onLocationChange}
            />
        </>
    );
};

export default BaseLocation;

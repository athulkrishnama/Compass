import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "@/components/shared/modal/Modal";
import translationKey from "@/utils/i18n/translationKey";
import { SearchBox } from "@mapbox/search-js-react";
import { env } from "@/config/env";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Check, X } from "lucide-react";

interface UpdateBaseLocationModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onLocationChange: (city: string, cordinates: [number, number]) => void;
}

const UpdateBaseLocationModal: React.FC<UpdateBaseLocationModalProps> = ({
    isOpen,
    setIsOpen,
    onLocationChange,
}) => {
    const { t } = useTranslation();
    const [selectedCity, setSelectedCity] = useState<string>("");
    const [selectedCoordinates, setSelectedCoordinates] = useState<
        [number, number] | null
    >(null);

    function handleClose() {
        setIsOpen(false);
        setSelectedCity("");
        setSelectedCoordinates(null);
    }

    function handleSave() {
        if (selectedCity && selectedCoordinates) {
            onLocationChange(selectedCity, selectedCoordinates);
            handleClose();
        }
    }

    return (
        <Modal isOpen={isOpen} handleClose={handleClose}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-8 p-8 md:p-10"
            >
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="flex flex-col items-center gap-3 text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            delay: 0.2,
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                        }}
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-md"
                    >
                        <MapPin className="w-8 h-8 text-gray-800" />
                    </motion.div>
                    <h4 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                        {t(translationKey.headings.updateBaseLocation)}
                    </h4>
                    <p className="text-sm text-gray-500 max-w-md">
                        {t(translationKey.text.searchAndSelectBaseLocation)}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="w-full max-w-md mx-auto overflow-visible"
                >
                    <SearchBox
                        accessToken={env.VITE_MAPBOX_ACCESS_TOKEN}
                        options={{ types: "city" }}
                        onRetrieve={(res) => {
                            setSelectedCity(
                                res.features?.[0].properties?.name || ""
                            );
                            setSelectedCoordinates([
                                res.features?.[0].geometry?.coordinates?.[0],
                                res.features?.[0].geometry?.coordinates?.[1],
                            ]);
                        }}
                    />
                </motion.div>

                <AnimatePresence mode="wait">
                    {selectedCity && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="mx-auto"
                        >
                            <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-sm">
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 200,
                                        damping: 15,
                                    }}
                                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm"
                                >
                                    <Check className="w-5 h-5 text-green-600" />
                                </motion.div>
                                <div className="flex flex-col items-start">
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        {t(
                                            translationKey.text.selectedLocation
                                        )}
                                    </span>
                                    <span className="text-lg font-bold text-gray-900">
                                        {selectedCity}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className="flex items-center justify-center gap-4 mt-4"
                >
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        className="group px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold shadow-sm flex items-center gap-2"
                    >
                        <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                        {t(translationKey.button.cancel)}
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!selectedCity || !selectedCoordinates}
                        className="group px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900 font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                        <Check className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                        {t(translationKey.button.submit)}
                    </Button>
                </motion.div>
            </motion.div>
        </Modal>
    );
};

export default UpdateBaseLocationModal;

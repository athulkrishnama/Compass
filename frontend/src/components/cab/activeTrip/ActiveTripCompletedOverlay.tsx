import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import TRANSLATION_KEYS from "@/utils/i18n/translationKey";

interface ActiveTripCompletedOverlayProps {
    onAcknowledge: () => void;
}

export const ActiveTripCompletedOverlay: React.FC<
    ActiveTripCompletedOverlayProps
> = ({ onAcknowledge }) => {
    const { t } = useTranslation();

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center"
            >
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
                        <CheckCircle2 className="w-20 h-20 text-green-500 relative z-10 bg-white rounded-full" />
                    </div>
                </div>

                <h2 className="text-3xl font-black text-gray-900 mb-2">
                    {t(TRANSLATION_KEYS.bookingStatus.COMPLETED, "Completed")}
                </h2>
                <p className="text-gray-500 mb-8 font-medium">
                    {t(TRANSLATION_KEYS.activeTrip.droppedOffPassenger)}
                </p>

                <button
                    onClick={onAcknowledge}
                    className="w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest bg-gray-900 hover:bg-gray-800 text-white transition-all active:scale-95 shadow-lg shadow-gray-900/20"
                >
                    {t(TRANSLATION_KEYS.button.dashboard, "Dashboard")}
                </button>
            </motion.div>
        </div>
    );
};

import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import Modal from "@/components/shared/modal/Modal";

interface ActiveTripCancelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export function ActiveTripCancelModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
}: ActiveTripCancelModalProps) {
    const { t } = useTranslation();

    return (
        <Modal isOpen={isOpen} handleClose={onClose}>
            <div className="flex flex-col items-center text-center gap-4 pt-2">
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="w-14 h-14 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center"
                >
                    <AlertTriangle className="w-7 h-7 text-red-500" />
                </motion.div>

                <div>
                    <h3 className="text-lg font-black text-gray-900 leading-tight">
                        {t(translationKey.activeTrip.cancelRideTitle)}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                        {t(translationKey.activeTrip.cancelRideDescription)}
                    </p>
                </div>

                <div className="flex gap-3 w-full mt-1">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 active:scale-95 transition-all"
                    >
                        {t(translationKey.activeTrip.keepRide)}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-500 active:scale-95 transition-all disabled:opacity-60"
                    >
                        {t(translationKey.activeTrip.confirmCancel)}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

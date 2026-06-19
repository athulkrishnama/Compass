import { Map } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface ActiveTripMapOverlayProps {
    distanceMetres: number;
    eta: string;
    onOpenMaps?: () => void;
}

export function ActiveTripMapOverlay({
    distanceMetres,
    eta,
    onOpenMaps,
}: ActiveTripMapOverlayProps) {
    const { t } = useTranslation();
    const distanceKm = (distanceMetres / 1000).toFixed(1);

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[calc(100%-2rem)] max-w-sm"
        >
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 px-4 py-3 flex items-center gap-4">
                <div className="flex-1 flex items-center gap-6">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            {t(translationKey.activeTrip.distance)}
                        </p>
                        <p className="text-base font-black text-gray-900">
                            {distanceKm} km
                        </p>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            {t(translationKey.activeTrip.estArrival)}
                        </p>
                        <p className="text-base font-black text-gray-900">
                            {eta}
                        </p>
                    </div>
                </div>

                <button
                    onClick={onOpenMaps}
                    className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl px-3 py-2 active:scale-95 transition-all shrink-0"
                >
                    <Map className="w-4 h-4" />
                    {t(translationKey.activeTrip.openInMaps)}
                </button>
            </div>
        </motion.div>
    );
}

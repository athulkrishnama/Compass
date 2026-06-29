import { KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface ActiveTripOtpDisplayProps {
    otp: string;
}

export function ActiveTripOtpDisplay({ otp }: ActiveTripOtpDisplayProps) {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.08 }}
            className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-4 mt-4"
        >
            <div className="flex items-center gap-2 mb-3">
                <KeyRound className="w-4 h-4 text-gray-500" />
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    {t(translationKey.activeTrip.tripOtp)}
                </p>
            </div>

            <div className="flex gap-2 justify-center mb-2">
                {otp.split("").map((digit, i) => (
                    <div
                        key={i}
                        className="w-11 h-12 flex items-center justify-center bg-white border-2 border-gray-200 rounded-xl text-xl font-black text-gray-900 shadow-sm"
                    >
                        {digit}
                    </div>
                ))}
            </div>

            <p className="text-center text-xs text-gray-400 mt-2">
                {t(translationKey.activeTrip.shareOtpWithPassenger)}
            </p>
        </motion.div>
    );
}

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { CabPaymentMethod } from "@/enums/cabPaymentMethod";

interface PaymentSuccessProps {
    formattedFare: string;
    selectedMethod: CabPaymentMethod | null;
    handleDone: () => void;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
    formattedFare,
    selectedMethod,
    handleDone,
}) => {
    return (
        <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-8 flex flex-col items-center text-center space-y-5"
        >
            <div className="relative">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-60" />
                <CheckCircle2 className="w-20 h-20 text-green-500 relative z-10 bg-white rounded-full" />
            </div>
            <div>
                <h2 className="text-2xl font-black text-gray-900">
                    Payment Done!
                </h2>
                <p className="text-gray-500 mt-1 text-sm">
                    {selectedMethod === CabPaymentMethod.WALLET
                        ? `${formattedFare} was deducted from your wallet.`
                        : selectedMethod === CabPaymentMethod.STRIPE
                          ? `${formattedFare} paid successfully via card.`
                          : `Please hand ${formattedFare} cash to the driver.`}
                </p>
            </div>
            <button
                onClick={handleDone}
                className="w-full py-4 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm uppercase tracking-widest transition-all active:scale-[0.98]"
            >
                Done
            </button>
        </motion.div>
    );
};

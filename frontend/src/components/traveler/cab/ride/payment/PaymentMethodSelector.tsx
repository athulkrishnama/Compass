import React from "react";
import { motion } from "framer-motion";
import {
    Wallet,
    Banknote,
    CreditCard,
    CheckCircle2,
    Loader2,
    X,
} from "lucide-react";
import { CabPaymentMethod } from "@/enums/cabPaymentMethod";

const PAYMENT_OPTIONS = [
    {
        id: CabPaymentMethod.WALLET,
        label: "Wallet",
        description: "Instantly paid from your Compass balance",
        Icon: Wallet,
        border: "border-violet-200",
        selectedBorder: "border-violet-500",
        selectedBg: "bg-violet-50",
        iconColor: "text-violet-600",
    },
    {
        id: CabPaymentMethod.STRIPE,
        label: "Card / Online",
        description: "Pay securely with any card via Stripe",
        Icon: CreditCard,
        border: "border-blue-200",
        selectedBorder: "border-blue-500",
        selectedBg: "bg-blue-50",
        iconColor: "text-blue-600",
    },
    {
        id: CabPaymentMethod.CASH,
        label: "Cash",
        description: "Pay the driver in cash directly",
        Icon: Banknote,
        border: "border-emerald-200",
        selectedBorder: "border-emerald-500",
        selectedBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
    },
] as const;

interface PaymentMethodSelectorProps {
    formattedFare: string;
    selectedMethod: CabPaymentMethod | null;
    setSelectedMethod: (method: CabPaymentMethod) => void;
    isLoading: boolean;
    handlePay: () => void;
    handleClose: () => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
    formattedFare,
    selectedMethod,
    setSelectedMethod,
    isLoading,
    handlePay,
    handleClose,
}) => {
    return (
        <motion.div
            key="select"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 space-y-5"
        >
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        Complete Payment
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Your ride has ended. Choose how to pay.
                    </p>
                </div>
                <button
                    onClick={handleClose}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Fare summary */}
            <div className="flex items-center justify-between rounded-2xl bg-gray-50 border border-gray-100 px-5 py-4">
                <span className="text-sm font-medium text-gray-500">
                    Total Fare
                </span>
                <span className="text-2xl font-black text-gray-900 tracking-tight">
                    {formattedFare}
                </span>
            </div>

            {/* Payment method options */}
            <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Select Payment Method
                </p>
                {PAYMENT_OPTIONS.map(
                    ({
                        id,
                        label,
                        description,
                        Icon,
                        border,
                        selectedBorder,
                        selectedBg,
                        iconColor,
                    }) => {
                        const isSelected = selectedMethod === id;
                        return (
                            <button
                                key={id}
                                onClick={() => setSelectedMethod(id)}
                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border-2 transition-all text-left ${
                                    isSelected
                                        ? `${selectedBorder} ${selectedBg} shadow-sm`
                                        : `${border} bg-white hover:bg-gray-50`
                                }`}
                            >
                                <div
                                    className={`p-2.5 rounded-xl ${isSelected ? "bg-white shadow-sm" : "bg-gray-100"}`}
                                >
                                    <Icon
                                        className={`w-5 h-5 ${isSelected ? iconColor : "text-gray-400"}`}
                                    />
                                </div>
                                <div className="flex-1">
                                    <p
                                        className={`text-sm font-semibold ${isSelected ? "text-gray-900" : "text-gray-700"}`}
                                    >
                                        {label}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {description}
                                    </p>
                                </div>
                                {isSelected && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className={iconColor}
                                    >
                                        <CheckCircle2 className="w-5 h-5" />
                                    </motion.div>
                                )}
                            </button>
                        );
                    }
                )}
            </div>

            {/* CTA */}
            <button
                onClick={handlePay}
                disabled={!selectedMethod || isLoading}
                className="w-full py-4 rounded-2xl bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-sm uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-gray-900/10 flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing…
                    </>
                ) : (
                    `Pay ${formattedFare}`
                )}
            </button>
        </motion.div>
    );
};

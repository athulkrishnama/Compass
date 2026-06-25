import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    initiateCabPayment,
    processWalletCabPayment,
} from "@/services/api/paymentService";
import { CabPaymentMethod } from "@/enums/cabPaymentMethod";

import { PaymentMethodSelector } from "./payment/PaymentMethodSelector";
import { StripePaymentView } from "./payment/StripePaymentView";
import { PaymentSuccess } from "./payment/PaymentSuccess";

interface RidePaymentModalProps {
    isOpen: boolean;
    tripId: string;
    fareAmount: number;
    currency?: string;
    onSuccess: () => void;
    onClose: () => void;
}

type ModalStep = "select" | "stripe" | "success";

export const RidePaymentModal: React.FC<RidePaymentModalProps> = ({
    isOpen,
    tripId,
    fareAmount,
    currency = "INR",
    onSuccess,
    onClose,
}) => {
    const [selectedMethod, setSelectedMethod] =
        useState<CabPaymentMethod | null>(null);
    const [step, setStep] = useState<ModalStep>("select");
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const formattedFare = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(fareAmount);

    const initiateMutation = useMutation({
        mutationFn: () => initiateCabPayment(tripId, selectedMethod!),
        onSuccess: async (data) => {
            if (selectedMethod === CabPaymentMethod.WALLET) {
                walletMutation.mutate();
            } else if (selectedMethod === CabPaymentMethod.STRIPE) {
                const secret = data?.data?.clientSecret;
                if (!secret) {
                    toast.error("Failed to create payment session.");
                    return;
                }
                setClientSecret(secret);
                setStep("stripe");
            } else {
                setStep("success");
                toast.success("Payment recorded", {
                    description: "Please hand the fare to the driver.",
                });
            }
        },
        onError: (err: Error) => {
            toast.error("Payment failed", { description: err.message });
        },
    });

    const walletMutation = useMutation({
        mutationFn: () => processWalletCabPayment(tripId),
        onSuccess: () => {
            setStep("success");
            toast.success("Payment successful!", {
                description: "Fare deducted from your wallet.",
            });
        },
        onError: (err: Error) => {
            toast.error("Wallet payment failed", { description: err.message });
        },
    });

    const isLoading = initiateMutation.isPending || walletMutation.isPending;

    const handlePay = () => {
        if (!selectedMethod || isLoading) return;
        initiateMutation.mutate();
    };

    const handleStripeSuccess = () => {
        setStep("success");
        onSuccess();
    };

    const handleDone = () => {
        onSuccess();
        onClose();
    };

    const handleClose = () => {
        if (step !== "success") onClose();
    };

    const handleReset = () => {
        setStep("select");
        setClientSecret(null);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) handleClose();
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 60, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 60, scale: 0.96 }}
                        transition={{
                            type: "spring",
                            stiffness: 320,
                            damping: 30,
                        }}
                        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                    >
                        <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-blue-500 to-emerald-500" />

                        <AnimatePresence mode="wait">
                            {step === "select" && (
                                <PaymentMethodSelector
                                    formattedFare={formattedFare}
                                    selectedMethod={selectedMethod}
                                    setSelectedMethod={setSelectedMethod}
                                    isLoading={isLoading}
                                    handlePay={handlePay}
                                    handleClose={handleClose}
                                />
                            )}

                            {step === "stripe" && clientSecret && (
                                <StripePaymentView
                                    clientSecret={clientSecret}
                                    formattedFare={formattedFare}
                                    onSuccess={handleStripeSuccess}
                                    onBack={handleReset}
                                />
                            )}

                            {step === "success" && (
                                <PaymentSuccess
                                    formattedFare={formattedFare}
                                    selectedMethod={selectedMethod}
                                    handleDone={handleDone}
                                />
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

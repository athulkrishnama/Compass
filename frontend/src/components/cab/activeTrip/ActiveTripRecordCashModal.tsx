import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { recordCashPayment } from "@/services/api/paymentService";
import { getWalletSummary } from "@/services/api/walletService";
import { Loader2, Wallet, X } from "lucide-react";

interface ActiveTripRecordCashModalProps {
    isOpen: boolean;
    tripId: string;
    expectedAmount: number;
    onSuccess: () => void;
    onClose?: () => void;
}

export const ActiveTripRecordCashModal: React.FC<
    ActiveTripRecordCashModalProps
> = ({ isOpen, tripId, expectedAmount, onSuccess, onClose }) => {
    const [amount, setAmount] = useState<string>(expectedAmount.toString());

    const { data: walletSummary, isLoading: isWalletLoading } = useQuery({
        queryKey: ["walletSummary"],
        queryFn: getWalletSummary,
        enabled: isOpen,
    });

    useEffect(() => {
        if (isOpen) {
            setAmount(expectedAmount.toString());
        }
    }, [isOpen, expectedAmount]);

    const { mutate, isPending } = useMutation({
        mutationFn: () => recordCashPayment(tripId, Number(amount)),
        onSuccess: () => {
            toast.success("Cash payment recorded successfully.");
            onSuccess();
        },
        onError: (err: Error) => {
            toast.error("Failed to record cash payment", {
                description: err.message,
            });
        },
    });

    const handleConfirm = () => {
        const numAmount = Number(amount);
        if (isNaN(numAmount) || numAmount < expectedAmount) {
            toast.error("Invalid amount", {
                description: `Amount must be at least ₹${expectedAmount}`,
            });
            return;
        }

        const excessAmount = numAmount - expectedAmount;
        if (excessAmount > 0) {
            if (!walletSummary) {
                toast.error("Wallet Data Missing", {
                    description: "Please wait for wallet balance to load.",
                });
                return;
            }
            if (excessAmount > walletSummary.balance) {
                toast.error("Insufficient Wallet Balance", {
                    description: `You only have ₹${walletSummary.balance} in your wallet to cover the excess cash.`,
                });
                return;
            }
        }

        mutate();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <h2 className="text-xl font-bold text-gray-900">
                                Collect Cash
                            </h2>
                            {onClose && (
                                <button
                                    onClick={onClose}
                                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors -mt-1 -mr-1"
                                    aria-label="Close"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 mb-6">
                            The rider chose to pay with cash. Please collect the
                            fare and enter the amount received.
                        </p>

                        <div className="flex items-center gap-2 mb-6 p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <Wallet className="w-5 h-5 text-gray-900" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Your Wallet Balance
                                </p>
                                <p className="text-lg font-black text-gray-900">
                                    {isWalletLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        `₹${walletSummary?.balance ?? 0}`
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                Amount Received (Expected: ₹{expectedAmount})
                            </label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full text-2xl font-black text-gray-900 p-4 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none"
                            />
                        </div>

                        <button
                            onClick={handleConfirm}
                            disabled={isPending || isWalletLoading}
                            className="w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm text-white bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 active:scale-95 transition-all flex justify-center items-center gap-2"
                        >
                            {isPending || isWalletLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Confirm Payment"
                            )}
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

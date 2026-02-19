import { motion } from "framer-motion";
import { AlertTriangle, Clock, IndianRupee, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import Modal from "@/components/shared/modal/Modal";
import { differenceInHours, parseISO } from "date-fns";

interface CancellationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isPending: boolean;
    checkInDate: string;
    totalAmount: number;
}

function getRefundInfo(checkInDate: string, totalAmount: number) {
    const now = new Date();
    const checkIn = parseISO(checkInDate);
    const hoursUntilCheckIn = differenceInHours(checkIn, now);

    if (hoursUntilCheckIn >= 48) {
        return {
            percentage: 100,
            amount: totalAmount,
            tier: "full" as const,
        };
    } else if (hoursUntilCheckIn >= 24) {
        return {
            percentage: 50,
            amount: Math.round(totalAmount * 0.5),
            tier: "half" as const,
        };
    } else {
        return {
            percentage: 0,
            amount: 0,
            tier: "none" as const,
        };
    }
}

export function CancellationModal({
    isOpen,
    onClose,
    onConfirm,
    isPending,
    checkInDate,
    totalAmount,
}: CancellationModalProps) {
    const { t } = useTranslation();
    const refundInfo = getRefundInfo(checkInDate, totalAmount);

    const tierConfig = {
        full: {
            color: "text-green-600",
            bg: "bg-green-50",
            border: "border-green-200",
            label: t(translationKey.bookingDetails.fullRefund),
        },
        half: {
            color: "text-foreground",
            bg: "bg-muted/50",
            border: "border-border",
            label: t(translationKey.bookingDetails.halfRefund),
        },
        none: {
            color: "text-red-600",
            bg: "bg-red-50",
            border: "border-red-200",
            label: t(translationKey.bookingDetails.noRefund),
        },
    };

    const currentTier = tierConfig[refundInfo.tier];

    return (
        <Modal isOpen={isOpen} handleClose={onClose}>
            <div className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-red-50 border border-red-100">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-foreground">
                            {t(
                                translationKey.bookingDetails
                                    .cancellationPolicyTitle
                            )}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {t(
                                translationKey.bookingDetails
                                    .cancelConfirmMessage
                            )}
                        </p>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`p-4 rounded-xl border ${currentTier.border} ${currentTier.bg}`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p
                                className={`text-sm font-bold ${currentTier.color}`}
                            >
                                {currentTier.label}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {t(translationKey.bookingDetails.yourRefund)}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-1">
                                <IndianRupee
                                    className={`w-4 h-4 ${currentTier.color}`}
                                />
                                <span
                                    className={`text-xl font-black ${currentTier.color}`}
                                >
                                    {refundInfo.amount.toLocaleString("en-IN")}
                                </span>
                            </div>
                            <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
                                {refundInfo.percentage}% of ₹
                                {totalAmount.toLocaleString("en-IN")}
                            </p>
                        </div>
                    </div>
                </motion.div>

                <div className="space-y-2">
                    <p className="text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground">
                        {t(translationKey.bookingDetails.cancellationPolicy)}
                    </p>
                    <div className="space-y-1.5">
                        {[
                            {
                                key: "full",
                                label: t(
                                    translationKey.bookingDetails.policyTierFull
                                ),
                                active: refundInfo.tier === "full",
                            },
                            {
                                key: "half",
                                label: t(
                                    translationKey.bookingDetails.policyTierHalf
                                ),
                                active: refundInfo.tier === "half",
                            },
                            {
                                key: "none",
                                label: t(
                                    translationKey.bookingDetails.policyTierNone
                                ),
                                active: refundInfo.tier === "none",
                            },
                        ].map((tier) => (
                            <div
                                key={tier.key}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                                    tier.active
                                        ? "bg-black text-white font-semibold"
                                        : "text-muted-foreground"
                                }`}
                            >
                                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>{tier.label}</span>
                                {tier.active && (
                                    <Check className="w-3.5 h-3.5 ml-auto" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="flex-1 px-4 py-2.5 rounded-full border border-border text-sm font-semibold text-muted-foreground hover:bg-muted transition-all duration-300 disabled:opacity-50"
                    >
                        {t(translationKey.bookingDetails.no)}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isPending}
                        className="flex-1 px-4 py-2.5 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending
                            ? t(translationKey.bookingDetails.cancelling)
                            : t(
                                  translationKey.bookingDetails
                                      .confirmCancellation
                              )}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

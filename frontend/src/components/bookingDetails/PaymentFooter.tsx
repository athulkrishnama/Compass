import { motion } from "framer-motion";
import { BookingStatus } from "@/enums/bookingStatus";
import { isPast, parseISO } from "date-fns";
import { Trash2, Copy, IndianRupee } from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCancelBookingMutationOptions } from "@/queryOptions/bookingQueryOptions";
import { CancellationModal } from "./CancellationModal";
import { toast } from "sonner";
import type { HttpResponse } from "@/types/api/responseType";
import type { IBookingDetailsResponseDTO } from "@/types/api/responses/bookingResponse";
import { QUERY_KEYS } from "@/constants/queryKeys/queryKeys";

interface PaymentFooterProps {
    totalAmount: number;
    paymentIntendId: string;
    bookingStatus: BookingStatus;
    checkInDate: string;
    bookingId: string;
    refundAmount?: number;
    refundStatus?: string;
}

export function PaymentFooter({
    totalAmount,
    paymentIntendId,
    bookingStatus,
    checkInDate,
    bookingId,
    refundAmount,
    refundStatus,
}: PaymentFooterProps) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [showCancelModal, setShowCancelModal] = useState(false);

    const isCheckInPast = isPast(parseISO(checkInDate));
    const isCancelled = bookingStatus === BookingStatus.CANCELLED;
    const canCancel =
        bookingStatus !== BookingStatus.COMPLETED &&
        !isCancelled &&
        !isCheckInPast;

    const cancelMutation = useMutation({
        ...createCancelBookingMutationOptions(bookingId),
        onSuccess: (response) => {
            toast.success(t(translationKey.bookingDetails.cancelSuccess));

            queryClient.setQueryData<HttpResponse<IBookingDetailsResponseDTO>>(
                [QUERY_KEYS.BOOKING_DETAILS, bookingId],
                (old) => {
                    if (!old?.data) return old;
                    return {
                        ...old,
                        data: {
                            ...old.data,
                            bookingStatus: BookingStatus.CANCELLED,
                            refundAmount: response.data?.refundAmount ?? 0,
                            refundStatus:
                                response.data?.refundPercentage === 100
                                    ? "REFUNDED"
                                    : response.data?.refundPercentage > 0
                                      ? "PARTIAL"
                                      : "NONE",
                        },
                    };
                }
            );

            setShowCancelModal(false);
        },
    });

    const refundLabel =
        refundStatus === "REFUNDED"
            ? t(translationKey.bookingDetails.fullRefund)
            : refundStatus === "PARTIAL"
              ? t(translationKey.bookingDetails.halfRefund)
              : t(translationKey.bookingDetails.noRefund);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="rounded-2xl border border-border bg-muted/30 p-6 shadow-lg"
            >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div>
                            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
                                {t(
                                    translationKey.bookingDetails
                                        .totalAmountPaid
                                )}
                            </p>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span
                                    className={`text-3xl font-black ${isCancelled ? "line-through text-muted-foreground" : "text-foreground"}`}
                                >
                                    ₹
                                    {totalAmount.toLocaleString("en-IN", {
                                        minimumFractionDigits: 2,
                                    })}
                                </span>
                                <span className="text-xs text-muted-foreground uppercase font-medium">
                                    INR
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {t(translationKey.bookingDetails.includesTaxes)}
                            </p>
                        </div>

                        {isCancelled && refundAmount !== undefined && (
                            <div className="px-4 py-3 border border-border rounded-xl bg-background">
                                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1">
                                    {t(
                                        translationKey.bookingDetails
                                            .refundedAmount
                                    )}
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <span
                                        className={`text-xl font-black ${refundAmount > 0 ? "text-emerald-600" : "text-red-500"}`}
                                    >
                                        ₹
                                        {refundAmount.toLocaleString("en-IN", {
                                            minimumFractionDigits: 2,
                                        })}
                                    </span>
                                    <span
                                        className={`text-[10px] font-bold tracking-wider uppercase ${refundAmount > 0 ? "text-emerald-600" : "text-red-500"}`}
                                    >
                                        {refundLabel}
                                    </span>
                                </div>
                            </div>
                        )}

                        {paymentIntendId && (
                            <div className="px-4 py-3 border border-border rounded-xl bg-background">
                                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1">
                                    {t(
                                        translationKey.bookingDetails
                                            .transactionId
                                    )}
                                </p>
                                <div className="flex items-center gap-2">
                                    <code className="text-sm font-mono text-foreground">
                                        {paymentIntendId.slice(0, 18)}
                                    </code>
                                    <button
                                        onClick={() =>
                                            navigator.clipboard.writeText(
                                                paymentIntendId
                                            )
                                        }
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {canCancel && (
                            <button
                                onClick={() => setShowCancelModal(true)}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 hover:border-red-300 transition-all duration-300 active:scale-95"
                            >
                                <Trash2 className="w-4 h-4" />
                                {t(translationKey.bookingDetails.cancelBooking)}
                            </button>
                        )}
                        <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black text-white text-sm font-semibold hover:bg-black/90 shadow-md hover:shadow-lg transition-all duration-300 active:scale-95">
                            <IndianRupee className="w-4 h-4" />
                            {t(translationKey.bookingDetails.printReceipt)}
                        </button>
                    </div>
                </div>
            </motion.div>

            <CancellationModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={() => cancelMutation.mutate()}
                isPending={cancelMutation.isPending}
                checkInDate={checkInDate}
                totalAmount={totalAmount}
            />
        </>
    );
}

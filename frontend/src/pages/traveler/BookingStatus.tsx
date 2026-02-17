import { Button } from "@/components/ui/button";
import { bookingQueryOptions } from "@/utils/queryOptions/bookingQueryOptions";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearch } from "@tanstack/react-router";
import translationKey from "@/utils/i18n/translationKey";
import { useEffect } from "react";
import { BookingStatusResponseStatus } from "@/types/booking";

export default function BookingStatus() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const search = useSearch({ from: "/traveler/booking-status" });
    const paymentIntentId = search.payment_intent;

    const {
        data: bookingResponse,
        isLoading,
        error,
    } = useQuery(
        bookingQueryOptions.getBookingByPaymentId(paymentIntentId || "")
    );

    const isPending =
        bookingResponse?.status === BookingStatusResponseStatus.PENDING;
    const isSuccess =
        bookingResponse?.status === BookingStatusResponseStatus.SUCCESS;
    const isTimeout =
        bookingResponse?.status === BookingStatusResponseStatus.TIMEOUT;

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                navigate({ to: "/traveler/history" });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, navigate]);

    if (!paymentIntentId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
                <XCircle className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {t(translationKey.bookingConfirmation.paymentFailedTitle)}
                </h1>
                <p className="text-gray-600 mb-6">
                    {t(translationKey.bookingConfirmation.paymentFailedMessage)}
                </p>
                <Button onClick={() => navigate({ to: "/" })}>
                    {t(translationKey.bookingConfirmation.goToHome)}
                </Button>
            </div>
        );
    }

    if (isLoading || isPending) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
                <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {t(translationKey.bookingConfirmation.verifyingPayment)}
                </h1>
                <p className="text-gray-600">
                    {t(translationKey.bookingConfirmation.verifyingPayment)}
                </p>
            </div>
        );
    }

    if (error || isTimeout) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
                <XCircle className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {t(translationKey.bookingConfirmation.paymentFailedTitle)}
                </h1>
                <p className="text-gray-600 mb-6">
                    {isTimeout
                        ? t(
                              translationKey.bookingConfirmation
                                  .paymentTimeoutMessage
                          )
                        : t(
                              translationKey.bookingConfirmation
                                  .paymentFailedMessage
                          )}
                </p>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => window.location.reload()}
                    >
                        {t(translationKey.bookingConfirmation.tryAgain)}
                    </Button>
                    <Button onClick={() => navigate({ to: "/" })}>
                        {t(translationKey.bookingConfirmation.goToHome)}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {t(translationKey.bookingConfirmation.bookingConfirmed)}
            </h1>
            <p className="text-gray-600 mb-6">
                {t(translationKey.bookingConfirmation.redirectingToHistory)}
            </p>
        </div>
    );
}

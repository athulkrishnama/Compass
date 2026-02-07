import { motion } from "framer-motion";
import { Lock, CheckCircle2, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loadStripe } from "@stripe/stripe-js";
import {
    PaymentElement,
    Elements,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { env } from "@/config/env";
import { useState } from "react";
import { toast } from "sonner";
import translationKey from "@/utils/i18n/translationKey";
import { useTranslation } from "react-i18next";

interface PaymentSummaryCardProps {
    amount: number;
    nights: number;
    paymentIntentId: string;
    clientSecret: string;
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1] as const,
        },
    },
};

export function PaymentSummaryCard({
    amount,
    nights,
}: PaymentSummaryCardProps) {
    const { t } = useTranslation();
    const basePrice = nights > 0 ? Math.round(amount / nights) : 0;

    const strip = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!strip || !elements) {
            return;
        }

        setLoading(true);

        const { error } = await strip.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/traveler/booking-success`,
            },
        });

        if (error) {
            toast.error(t(translationKey.errors.paymentFailed));
        }

        setLoading(false);
    }

    return (
        <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6"
        >
            <h2 className="text-lg font-bold text-gray-900 mb-6">
                {t(translationKey.bookingConfirmation.paymentSummary)}
            </h2>

            <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                        {t(translationKey.bookingConfirmation.basePrice)}
                    </span>
                    <span className="text-gray-900 font-medium">
                        ₹{basePrice.toLocaleString("en-IN")}{" "}
                        {t(translationKey.bookingConfirmation.perNight)}
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                        {t(translationKey.bookingConfirmation.duration)}
                    </span>
                    <span className="text-gray-900 font-medium">
                        {nights} {t(translationKey.bookingConfirmation.nights)}
                    </span>
                </div>
                <div className="flex justify-between text-sm pt-4 border-t border-gray-100">
                    <span className="text-gray-500">
                        {t(translationKey.bookingConfirmation.subtotal)}
                    </span>
                    <span className="text-gray-900 font-medium">
                        ₹{amount.toLocaleString("en-IN")}
                    </span>
                </div>
            </div>

            <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-200">
                <span className="text-gray-700 font-medium">
                    {t(translationKey.bookingConfirmation.totalAmount)}
                </span>
                <span className="text-2xl font-bold text-gray-900 flex items-center">
                    <IndianRupee className="w-5 h-5" />
                    {amount.toLocaleString("en-IN")}
                </span>
            </div>

            <form onSubmit={handleSubmit}>
                <PaymentElement />
                <Button
                    disabled={loading || !strip || !elements}
                    className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl shadow-lg"
                >
                    <Lock className="w-4 h-4 mr-2" />
                    {t(translationKey.bookingConfirmation.payNow)}
                </Button>
            </form>

            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-400">
                <Lock className="w-4 h-4" />
                <span>
                    {t(translationKey.bookingConfirmation.secureTransaction)}
                </span>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-gray-700" />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900">
                            {t(
                                translationKey.bookingConfirmation
                                    .instantConfirmation
                            )}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {t(
                                translationKey.bookingConfirmation
                                    .bookingGuaranteed
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function CheckOutCard(props: PaymentSummaryCardProps) {
    return (
        <Elements
            stripe={loadStripe(env.VITE_STRIPE_PUBLIC_KEY)}
            options={{
                clientSecret: props.clientSecret,
                appearance: { theme: "stripe" },
            }}
        >
            <PaymentSummaryCard {...props} />
        </Elements>
    );
}

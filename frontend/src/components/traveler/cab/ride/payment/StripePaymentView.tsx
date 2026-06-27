import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Lock, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { env } from "@/config/env";

const stripePromise = loadStripe(env.VITE_STRIPE_PUBLIC_KEY);

interface StripePayFormProps {
    formattedFare: string;
    onSuccess: () => void;
    onBack: () => void;
}

function StripePayForm({
    formattedFare,
    onSuccess,
    onBack,
}: StripePayFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsLoading(true);
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.href,
            },
            redirect: "if_required",
        });

        if (error) {
            toast.error("Stripe payment failed", {
                description: error.message,
            });
            setIsLoading(false);
        } else if (paymentIntent?.status === "succeeded") {
            toast.success("Payment successful!", {
                description: "Your fare was paid via card.",
            });
            onSuccess();
        } else {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onBack}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">
                        Card Payment
                    </h2>
                    <p className="text-sm text-gray-400">
                        Paying {formattedFare} securely
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-100 p-4 bg-gray-50">
                <PaymentElement
                    options={{
                        layout: "accordion",
                    }}
                />
            </div>

            <button
                type="submit"
                disabled={!stripe || !elements || isLoading}
                className="w-full py-4 rounded-2xl bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-sm uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing…
                    </>
                ) : (
                    <>
                        <Lock className="w-4 h-4" />
                        Pay {formattedFare}
                    </>
                )}
            </button>

            <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3" />
                Secured by Stripe
            </p>
        </form>
    );
}

interface StripePaymentViewProps {
    clientSecret: string;
    formattedFare: string;
    onSuccess: () => void;
    onBack: () => void;
}

export const StripePaymentView: React.FC<StripePaymentViewProps> = ({
    clientSecret,
    formattedFare,
    onSuccess,
    onBack,
}) => {
    return (
        <motion.div
            key="stripe"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
        >
            <Elements
                stripe={stripePromise}
                options={{
                    clientSecret,
                    appearance: {
                        theme: "flat",
                        variables: {
                            colorPrimary: "#111827",
                            borderRadius: "12px",
                            fontFamily: "Inter, system-ui, sans-serif",
                        },
                    },
                }}
            >
                <StripePayForm
                    formattedFare={formattedFare}
                    onSuccess={onSuccess}
                    onBack={onBack}
                />
            </Elements>
        </motion.div>
    );
};

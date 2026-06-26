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

interface StripeTopUpFormProps {
    amount: number;
    onSuccess: () => void;
    onBack: () => void;
}

function StripeTopUpForm({
    amount,
    onSuccess,
    onBack,
}: StripeTopUpFormProps) {
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
            toast.success("Top Up successful!", {
                description: `₹${amount.toFixed(2)} added to your wallet.`,
            });
            onSuccess();
        } else {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onBack}
                    className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
                        Complete Payment
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Adding ₹{amount.toFixed(2)} to wallet
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border border-neutral-100 dark:border-neutral-700 p-4 bg-neutral-50 dark:bg-neutral-800/50">
                <PaymentElement
                    options={{
                        layout: "accordion",
                    }}
                />
            </div>

            <button
                type="submit"
                disabled={!stripe || !elements || isLoading}
                className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-200 disabled:text-neutral-400 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-600 text-white font-bold text-sm tracking-wide transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing…
                    </>
                ) : (
                    <>
                        <Lock className="w-4 h-4" />
                        Pay ₹{amount.toFixed(2)}
                    </>
                )}
            </button>

            <p className="text-center text-xs text-neutral-400 flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3" />
                Secured by Stripe
            </p>
        </form>
    );
}

interface StripeTopUpViewProps {
    clientSecret: string;
    amount: number;
    onSuccess: () => void;
    onBack: () => void;
}

export const StripeTopUpView: React.FC<StripeTopUpViewProps> = ({
    clientSecret,
    amount,
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
                            colorPrimary: "#4f46e5", // indigo-600
                            borderRadius: "12px",
                            fontFamily: "Inter, system-ui, sans-serif",
                        },
                    },
                }}
            >
                <StripeTopUpForm
                    amount={amount}
                    onSuccess={onSuccess}
                    onBack={onBack}
                />
            </Elements>
        </motion.div>
    );
};

import OTP from "@/components/shared/OTP/OTP";
import { Button } from "@/components/ui/button";
import translationKey from "@/utils/i18n/translationKey";
import { motion } from "framer-motion";
import { ArrowRight, Clock, RefreshCw } from "lucide-react";
import { type RefObject, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const OTP_TIMER_SECONDS = 2 * 60; // 2 minutes

interface VerifyOtpStepProps {
    isLoading: boolean;
    isResending: boolean;
    otpInputRefs: RefObject<(HTMLInputElement | null)[]>;
    onOtpComplete: (otp: string) => void;
    onResendOtp: (onSuccess?: () => void) => void;
}

function VerifyOtpStep({
    isLoading,
    isResending,
    otpInputRefs,
    onOtpComplete,
    onResendOtp,
}: VerifyOtpStepProps) {
    const { t } = useTranslation();
    const [timeLeft, setTimeLeft] = useState(OTP_TIMER_SECONDS);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const isTimeExpired = timeLeft <= 0;
    const isTimeLow = timeLeft <= 30 && timeLeft > 0;

    const formatTime = (num: number) => num.toString().padStart(2, "0");

    const handleResendClick = () => {
        onResendOtp(() => {
            setTimeLeft(OTP_TIMER_SECONDS);
            otpInputRefs.current.forEach((ref) => {
                if (ref) ref.value = "";
            });
            otpInputRefs.current[0]?.focus();
        });
    };

    const handleManualVerify = () => {
        const otp = otpInputRefs.current
            .map((ref) => (ref ? ref.value : ""))
            .join("");
        onOtpComplete(otp);
    };

    return (
        <motion.div
            key="verifyOtp"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="mb-6 text-center space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
                    {t(translationKey.headings.enterOtp)}
                </h2>
                <p className="text-sm text-zinc-500">
                    {t(translationKey.headings.otpHasSentToYourEmail)}
                </p>
            </div>

            <div className="space-y-4">
                <OTP
                    count={6}
                    handleComplete={onOtpComplete}
                    disabled={isLoading || isTimeExpired}
                    rootRef={otpInputRefs}
                />

                {/* Resend button (left) and Timer (right) */}
                <div className="flex items-center justify-between px-1">
                    <button
                        type="button"
                        onClick={handleResendClick}
                        disabled={isResending || isLoading}
                        className="text-sm text-zinc-600 hover:text-zinc-900 underline underline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                        {isResending ? (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                >
                                    <RefreshCw className="w-3 h-3" />
                                </motion.div>
                                {t(translationKey.button.sending)}
                            </>
                        ) : (
                            <>
                                <RefreshCw className="w-3 h-3" />
                                {t(translationKey.button.resend)}
                            </>
                        )}
                    </button>

                    <motion.div
                        className={`flex items-center gap-1.5 text-sm ${
                            isTimeExpired
                                ? "text-red-600"
                                : isTimeLow
                                  ? "text-orange-600"
                                  : "text-zinc-600"
                        }`}
                        animate={isTimeLow ? { scale: [1, 1.02, 1] } : {}}
                        transition={{
                            duration: 1,
                            repeat: isTimeLow ? Infinity : 0,
                        }}
                    >
                        <Clock className="w-3.5 h-3.5" />
                        <span className="font-mono font-medium">
                            {isTimeExpired
                                ? t(translationKey.text.expired)
                                : `${formatTime(minutes)}:${formatTime(seconds)}`}
                        </span>
                    </motion.div>
                </div>

                {/* Manual Verify Button */}
                <Button
                    type="button"
                    onClick={handleManualVerify}
                    disabled={isLoading || isTimeExpired}
                    className="w-full h-11 bg-zinc-950 hover:bg-zinc-800 text-white font-medium tracking-wide transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98] rounded-md"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                            />
                            {t(translationKey.button.verifing)}
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <ArrowRight className="w-4 h-4" />
                            {t(translationKey.button.verify)}
                        </span>
                    )}
                </Button>
            </div>
        </motion.div>
    );
}

export default VerifyOtpStep;

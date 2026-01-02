import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import translationKey from "@/utils/i18n/translationKey";
import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { useTranslation } from "react-i18next";

interface RequestOtpStepProps {
    currentEmail: string;
    isLoading: boolean;
    onRequestOtp: () => void;
}

function RequestOtpStep({
    currentEmail,
    isLoading,
    onRequestOtp,
}: RequestOtpStepProps) {
    const { t } = useTranslation();

    return (
        <motion.div
            key="requestOtp"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="mb-6 text-center space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
                    {t(translationKey.headings.changeEmail)}
                </h2>
                <p className="text-sm text-zinc-500">
                    {t(translationKey.text.sendVerificationCodeToCurrentEmail)}
                </p>
            </div>

            <div className="space-y-4">
                <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-zinc-900">
                        {t(translationKey.form.currentEmail)}
                    </Label>
                    <div className="relative group">
                        <div className="absolute left-3 top-3 text-zinc-400">
                            <Mail className="h-5 w-5" />
                        </div>
                        <Input
                            type="email"
                            value={currentEmail}
                            disabled
                            className="pl-10 h-11 bg-zinc-100 border-zinc-200 text-zinc-600 cursor-not-allowed"
                        />
                    </div>
                </div>

                <Button
                    onClick={onRequestOtp}
                    disabled={isLoading}
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
                            >
                                <Send className="h-4 w-4" />
                            </motion.div>
                            {t(translationKey.button.sending)}
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <Send className="h-4 w-4" />
                            {t(translationKey.button.sendOtp)}
                        </span>
                    )}
                </Button>
            </div>
        </motion.div>
    );
}

export default RequestOtpStep;

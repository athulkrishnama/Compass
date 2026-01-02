import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import translationKey from "@/utils/i18n/translationKey";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight, Mail } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { EmailFormType } from "../../../hooks/useChangeEmail";

interface NewEmailStepProps {
    form: UseFormReturn<EmailFormType>;
    isLoading: boolean;
    onSubmit: (data: EmailFormType) => void;
}

function NewEmailStep({ form, isLoading, onSubmit }: NewEmailStepProps) {
    const { t } = useTranslation();
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = form;

    return (
        <motion.div
            key="newEmail"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="mb-6 text-center space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
                    {t(translationKey.form.newEmail)}
                </h2>
                <p className="text-sm text-zinc-500">
                    {t(translationKey.text.enterNewEmailAddress)}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-zinc-900">
                        {t(translationKey.form.newEmail)}
                    </Label>
                    <div className="relative group">
                        <div className="absolute left-3 top-3 text-zinc-400 group-focus-within:text-black transition-colors duration-200">
                            <Mail className="h-5 w-5" />
                        </div>
                        <Input
                            type="email"
                            {...register("newEmail")}
                            className="pl-10 h-11 bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-0 transition-all rounded-md"
                            placeholder={t(translationKey.form.newEmail)}
                        />
                    </div>
                    <div className="min-h-[20px] overflow-hidden">
                        <AnimatePresence mode="wait">
                            {errors.newEmail && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, height: 0 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        height: "auto",
                                    }}
                                    exit={{ opacity: 0, y: -10, height: 0 }}
                                    transition={{
                                        duration: 0.2,
                                        ease: "easeInOut",
                                    }}
                                    className="flex items-center gap-2 text-red-600 mt-1"
                                >
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-xs font-medium">
                                        {errors.newEmail.message}
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <Button
                    type="submit"
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
                                <ArrowRight className="h-4 w-4" />
                            </motion.div>
                            {t(translationKey.button.submiting)}
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <ArrowRight className="h-4 w-4" />
                            {t(translationKey.button.submit)}
                        </span>
                    )}
                </Button>
            </form>
        </motion.div>
    );
}

export default NewEmailStep;

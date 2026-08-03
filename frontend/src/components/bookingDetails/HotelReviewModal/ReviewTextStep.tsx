import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface ReviewTextStepProps {
    value: string;
    onChange: (value: string) => void;
    onNext: () => void;
    onBack: () => void;
    stepIndex: number;
    totalSteps: number;
}

export function ReviewTextStep({
    value,
    onChange,
    onNext,
    onBack,
    stepIndex,
    totalSteps,
}: ReviewTextStepProps) {
    const { t } = useTranslation();

    return (
        <motion.div
            className="flex flex-col h-full"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
        >
            {/* Step progress dots */}
            <div className="flex items-center justify-center gap-1.5 mb-6 flex-shrink-0">
                {Array.from({ length: totalSteps }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="rounded-full bg-black"
                        animate={{
                            width: i === stepIndex ? 20 : 6,
                            height: 6,
                            opacity: i <= stepIndex ? 1 : 0.2,
                        }}
                        transition={{ duration: 0.3 }}
                    />
                ))}
            </div>

            <div className="flex-1 flex flex-col">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="w-8 h-8 text-white" />
                </div>

                <h2 className="text-2xl font-black text-black leading-tight mb-2 text-center">
                    {t(translationKey.hotelReviewModal.textStepTitle)}
                </h2>
                <p className="text-gray-400 text-sm mb-6 text-center">
                    {t(translationKey.hotelReviewModal.textStepDescription)}
                </p>

                <div className="flex-1 flex flex-col">
                    <Textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={t(
                            translationKey.hotelReviewModal.textStepPlaceholder
                        )}
                        maxLength={500}
                        className="flex-1 min-h-[140px] resize-none rounded-2xl border-gray-200 bg-gray-50 text-sm text-black placeholder:text-gray-400 focus:ring-black focus:border-black"
                    />
                    <p className="text-right text-xs text-gray-400 mt-1.5">
                        {value.length} / 500
                    </p>
                </div>
            </div>

            <div className="flex gap-3 flex-shrink-0 mt-4">
                <Button
                    variant="outline"
                    onClick={onBack}
                    className="flex-1 h-12 rounded-2xl border-gray-200 text-black font-bold hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {t(translationKey.hotelReviewModal.back)}
                </Button>
                <Button
                    onClick={onNext}
                    className="flex-1 h-12 rounded-2xl bg-black text-white font-bold hover:bg-black/90 flex items-center justify-center gap-2"
                >
                    {t(translationKey.hotelReviewModal.next)}
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </motion.div>
    );
}

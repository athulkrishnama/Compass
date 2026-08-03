import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmojiRatingPicker } from "./EmojiRatingPicker";
import type { ReviewAspect } from "./reviewAspects";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface ReviewAspectStepProps {
    aspect: ReviewAspect;
    value?: number;
    onChange: (value: number) => void;
    onNext: () => void;
    onBack: () => void;
    onSkip: () => void;
    stepIndex: number;
    totalSteps: number;
}

function AspectIcon({ Icon }: { Icon: LucideIcon }) {
    return (
        <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Icon className="w-8 h-8 text-white" />
        </div>
    );
}

export function ReviewAspectStep({
    aspect,
    value,
    onChange,
    onNext,
    onBack,
    onSkip,
    stepIndex,
    totalSteps,
}: ReviewAspectStepProps) {
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

            <div className="flex-1 flex flex-col items-center text-center">
                <AspectIcon Icon={aspect.icon} />

                <h2 className="text-2xl font-black text-black leading-tight mb-2">
                    {t(aspect.questionKey)}
                </h2>
                <p className="text-gray-400 text-sm mb-8 max-w-xs">
                    {t(aspect.descriptionKey)}
                </p>

                <div className="w-full max-w-xs">
                    <EmojiRatingPicker value={value} onChange={onChange} />
                </div>
            </div>

            {/* Skip link */}
            <div className="text-center mt-4 mb-2">
                <button
                    onClick={onSkip}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors inline-flex items-center gap-1"
                >
                    <SkipForward className="w-3 h-3" />
                    {t(translationKey.hotelReviewModal.skipQuestion)}
                </button>
            </div>

            {/* Navigation */}
            <div className="flex gap-3 flex-shrink-0">
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

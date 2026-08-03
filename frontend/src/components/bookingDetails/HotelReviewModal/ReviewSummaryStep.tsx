import { motion } from "framer-motion";
import {
    ArrowLeft,
    Pencil,
    Send,
    Angry,
    Frown,
    Meh,
    Smile,
    Laugh,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IReviewAspectRatings } from "@/types/api/requests/reviewRequests";
import { REVIEW_ASPECTS, EMOJI_LABELS_KEYS } from "./reviewAspects";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import type { LucideIcon } from "lucide-react";

const MOODS: { Icon: LucideIcon; color: string; bg: string }[] = [
    { Icon: Angry, color: "#EF4444", bg: "#FEE2E2" },
    { Icon: Frown, color: "#F97316", bg: "#FFEDD5" },
    { Icon: Meh, color: "#EAB308", bg: "#FEF9C3" },
    { Icon: Smile, color: "#22C55E", bg: "#DCFCE7" },
    { Icon: Laugh, color: "#06B6D4", bg: "#CFFAFE" },
];

interface ReviewSummaryStepProps {
    ratings: IReviewAspectRatings;
    comment?: string;
    onBack: () => void;
    onEditAspect: (aspectIndex: number) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
}

function MiniEmoji({ score }: { score: number }) {
    const { t } = useTranslation();
    const index = score - 1;
    const { Icon, color, bg } = MOODS[index];
    const labelKey = EMOJI_LABELS_KEYS[index];
    return (
        <div className="flex items-center gap-2">
            <span
                className="inline-flex items-center justify-center rounded-full w-8 h-8 flex-shrink-0"
                style={{ backgroundColor: bg }}
            >
                <Icon className="w-4 h-4" style={{ color }} />
            </span>
            <span className="text-xs font-semibold" style={{ color }}>
                {t(labelKey)}
            </span>
        </div>
    );
}

export function ReviewSummaryStep({
    ratings,
    comment,
    onBack,
    onEditAspect,
    onSubmit,
    isSubmitting,
}: ReviewSummaryStepProps) {
    const { t } = useTranslation();
    const answeredAspects = REVIEW_ASPECTS.filter(
        (a) => ratings[a.key] !== undefined
    );

    return (
        <motion.div
            className="flex flex-col h-full"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex-shrink-0 mb-4">
                <h2 className="text-2xl font-black text-black">
                    {t(translationKey.hotelReviewModal.summaryTitle)}
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                    {t(translationKey.hotelReviewModal.summaryDescription)}
                </p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
                {answeredAspects.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-8">
                        {t(translationKey.hotelReviewModal.noAspectsRated)}
                    </p>
                ) : (
                    answeredAspects.map((aspect, i) => {
                        const score = ratings[aspect.key]!;
                        const Icon = aspect.icon;
                        return (
                            <motion.div
                                key={aspect.key}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-2xl border border-gray-100"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-black">
                                            {t(aspect.labelKey)}
                                        </p>
                                        <MiniEmoji score={score} />
                                    </div>
                                </div>
                                <button
                                    onClick={() =>
                                        onEditAspect(
                                            REVIEW_ASPECTS.indexOf(aspect)
                                        )
                                    }
                                    className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
                                >
                                    <Pencil className="w-3.5 h-3.5 text-gray-500" />
                                </button>
                            </motion.div>
                        );
                    })
                )}

                {comment && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: answeredAspects.length * 0.05 }}
                        className="p-4 bg-gray-50 rounded-2xl border border-gray-100"
                    >
                        <p className="text-xs font-bold text-black uppercase tracking-wider mb-1">
                            {t(translationKey.hotelReviewModal.comment)}
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {comment}
                        </p>
                    </motion.div>
                )}
            </div>

            <div className="flex gap-3 flex-shrink-0 mt-4">
                <Button
                    variant="outline"
                    onClick={onBack}
                    className="flex-1 h-12 rounded-2xl border-gray-200 text-black font-bold hover:bg-gray-50 flex items-center justify-center gap-2"
                    disabled={isSubmitting}
                >
                    <ArrowLeft className="w-4 h-4" />
                    {t(translationKey.hotelReviewModal.back)}
                </Button>
                <Button
                    onClick={onSubmit}
                    disabled={isSubmitting || answeredAspects.length === 0}
                    className="flex-1 h-12 rounded-2xl bg-black text-white font-bold hover:bg-black/90 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                    ) : (
                        <>
                            {t(translationKey.hotelReviewModal.submitReview)}
                            <Send className="w-4 h-4" />
                        </>
                    )}
                </Button>
            </div>
        </motion.div>
    );
}

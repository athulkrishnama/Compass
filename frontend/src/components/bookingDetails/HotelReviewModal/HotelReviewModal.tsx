import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { IReviewAspectRatings } from "@/types/api/requests/reviewRequests";
import { createHotelReview } from "@/services/api/reviewApiService";
import { ReviewWelcomeStep } from "./ReviewWelcomeStep";
import { ReviewAspectStep } from "./ReviewAspectStep";
import { ReviewTextStep } from "./ReviewTextStep";
import { ReviewSummaryStep } from "./ReviewSummaryStep";
import { ReviewThankYouStep } from "./ReviewThankYouStep";
import { REVIEW_ASPECTS } from "./reviewAspects";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

const TOTAL_ASPECT_STEPS = REVIEW_ASPECTS.length; // 6
const TEXT_STEP = TOTAL_ASPECT_STEPS + 1; // 7
const SUMMARY_STEP = TOTAL_ASPECT_STEPS + 2; // 8
const THANKYOU_STEP = TOTAL_ASPECT_STEPS + 3; // 9

const DOTS_COUNT = TOTAL_ASPECT_STEPS + 1; // 7 dots (6 aspects + text)

interface HotelReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingId: string;
    hotelName: string;
    hotelCity: string;
    checkInDate: string;
    checkOutDate: string;
    coverImage?: string;
    onReviewSubmitted?: () => void;
}

export function HotelReviewModal({
    isOpen,
    onClose,
    bookingId,
    hotelName,
    hotelCity,
    checkInDate,
    checkOutDate,
    coverImage,
    onReviewSubmitted,
}: HotelReviewModalProps) {
    const { t } = useTranslation();
    const [step, setStep] = useState(0);
    const [ratings, setRatings] = useState<IReviewAspectRatings>({});
    const [comment, setComment] = useState("");

    const submitMutation = useMutation({
        mutationFn: () =>
            createHotelReview({
                bookingId,
                ratings,
                comment: comment || undefined,
            }),
        onSuccess: () => {
            setStep(THANKYOU_STEP);
            onReviewSubmitted?.();
        },
        onError: (error: Error) => {
            toast.error(
                error.message ||
                    t(translationKey.hotelReviewModal.failedToSubmit)
            );
        },
    });

    function handleAspectChange(
        key: keyof IReviewAspectRatings,
        value: number
    ) {
        setRatings((prev) => ({ ...prev, [key]: value }));
    }

    function goNext() {
        setStep((s) => s + 1);
    }

    function goBack() {
        setStep((s) => Math.max(0, s - 1));
    }

    function handleEditAspect(aspectIndex: number) {
        setStep(aspectIndex + 1);
    }

    function handleClose() {
        if (step === THANKYOU_STEP) {
            setStep(0);
            setRatings({});
            setComment("");
        }
        onClose();
    }

    const isAspectStep = step >= 1 && step <= TOTAL_ASPECT_STEPS;
    const aspectIndex = step - 1; // 0-indexed aspect
    const currentAspect = isAspectStep ? REVIEW_ASPECTS[aspectIndex] : null;

    const dotIndex = isAspectStep
        ? aspectIndex
        : step === TEXT_STEP
          ? TOTAL_ASPECT_STEPS
          : -1;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent
                className="sm:max-w-md p-0 gap-0 border-0 rounded-3xl overflow-hidden shadow-2xl"
                onInteractOutside={(e) => {
                    if (step === THANKYOU_STEP) return;
                    e.preventDefault();
                }}
            >
                {step !== THANKYOU_STEP && (
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-600" />
                    </button>
                )}

                <div className="p-6 min-h-[520px] flex flex-col bg-white">
                    <AnimatePresence mode="wait">
                        {step === 0 && (
                            <ReviewWelcomeStep
                                key="welcome"
                                hotelName={hotelName}
                                hotelCity={hotelCity}
                                checkInDate={checkInDate}
                                checkOutDate={checkOutDate}
                                coverImage={coverImage}
                                onStart={goNext}
                            />
                        )}

                        {isAspectStep && currentAspect && (
                            <ReviewAspectStep
                                key={`aspect-${aspectIndex}`}
                                aspect={currentAspect}
                                value={ratings[currentAspect.key]}
                                onChange={(v) =>
                                    handleAspectChange(currentAspect.key, v)
                                }
                                onNext={goNext}
                                onBack={goBack}
                                onSkip={goNext}
                                stepIndex={dotIndex}
                                totalSteps={DOTS_COUNT}
                            />
                        )}

                        {step === TEXT_STEP && (
                            <ReviewTextStep
                                key="text"
                                value={comment}
                                onChange={setComment}
                                onNext={goNext}
                                onBack={goBack}
                                stepIndex={dotIndex}
                                totalSteps={DOTS_COUNT}
                            />
                        )}

                        {step === SUMMARY_STEP && (
                            <ReviewSummaryStep
                                key="summary"
                                ratings={ratings}
                                comment={comment}
                                onBack={goBack}
                                onEditAspect={handleEditAspect}
                                onSubmit={() => submitMutation.mutate()}
                                isSubmitting={submitMutation.isPending}
                            />
                        )}

                        {step === THANKYOU_STEP && (
                            <ReviewThankYouStep
                                key="thankyou"
                                onClose={handleClose}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    );
}

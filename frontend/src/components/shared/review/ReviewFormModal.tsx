import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import StarRatingInput from "./StarRatingInput";

interface ReviewFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { rating: number; review: string }) => Promise<void>;
    title?: string;
    subtitle?: string;
}

const ReviewFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    title = "Rate your experience",
    subtitle = "Please let us know how your experience was.",
}: ReviewFormModalProps) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError("Please select a rating");
            return;
        }
        if (review.length < 10) {
            setError("Review must be at least 10 characters long");
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);
            await onSubmit({ rating, review });
            onClose();
            // Reset form on success
            setRating(0);
            setReview("");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to submit review");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div
                className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <p className="text-sm text-gray-500">{subtitle}</p>
                        <div className="flex justify-center py-4">
                            <StarRatingInput
                                rating={rating}
                                onRatingChange={(val) => {
                                    setRating(val);
                                    if (error && val > 0) setError(null);
                                }}
                                size="lg"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="review"
                            className="text-sm font-medium text-gray-700"
                        >
                            Your Review
                        </label>
                        <textarea
                            id="review"
                            value={review}
                            onChange={(e) => {
                                setReview(e.target.value);
                                if (error && e.target.value.length >= 10)
                                    setError(null);
                            }}
                            placeholder="Tell us about your experience..."
                            className="w-full min-h-[120px] p-3 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-y"
                            maxLength={500}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Minimum 10 characters</span>
                            <span>{review.length}/500</span>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-black text-white font-medium rounded-xl hover:bg-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                "Submit Review"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewFormModal;

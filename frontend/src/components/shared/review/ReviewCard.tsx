import { formatDistanceToNow } from "date-fns";
import { User } from "lucide-react";
import { Angry, Frown, Meh, Smile, Laugh } from "lucide-react";
import StarRatingDisplay from "./StarRatingDisplay";
import type {
    IHotelReviewResponse,
    ICabReviewResponse,
} from "@/types/api/responses/reviewResponses";

// ── Aspect config ─────────────────────────────────────────────────────────────
import {
    HeartHandshake,
    Users,
    Sparkles,
    Bed,
    Star,
    ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ASPECTS: { key: string; label: string; Icon: LucideIcon }[] = [
    { key: "hospitality", label: "Hospitality", Icon: HeartHandshake },
    { key: "staffFriendliness", label: "Staff Friendliness", Icon: Users },
    { key: "cleanliness", label: "Cleanliness", Icon: Sparkles },
    { key: "comfort", label: "Comfort", Icon: Bed },
    { key: "roomQuality", label: "Room Quality", Icon: Star },
    { key: "safety", label: "Safety", Icon: ShieldCheck },
];

const MOODS: { Icon: LucideIcon; color: string; bg: string; label: string }[] =
    [
        {
            Icon: Angry,
            color: "#EF4444",
            bg: "#FEE2E2",
            label: "Very Dissatisfied",
        },
        { Icon: Frown, color: "#F97316", bg: "#FFEDD5", label: "Dissatisfied" },
        { Icon: Meh, color: "#EAB308", bg: "#FEF9C3", label: "Neutral" },
        { Icon: Smile, color: "#22C55E", bg: "#DCFCE7", label: "Happy" },
        {
            Icon: Laugh,
            color: "#06B6D4",
            bg: "#CFFAFE",
            label: "Extremely Happy",
        },
    ];

function AspectMoodRow({ score }: { score: number }) {
    const selected = score - 1; // 0-indexed
    const { label } = MOODS[selected];

    return (
        <div className="flex items-center gap-1.5">
            {MOODS.map((mood, i) => {
                const MIcon = mood.Icon;
                const isActive = i === selected;
                return (
                    <span
                        key={i}
                        className="inline-flex items-center justify-center rounded-full"
                        style={{
                            width: 28,
                            height: 28,
                            backgroundColor: isActive ? mood.bg : "#F3F4F6",
                        }}
                    >
                        <MIcon
                            style={{
                                width: 15,
                                height: 15,
                                color: isActive ? mood.color : "#D1D5DB",
                                strokeWidth: isActive ? 2.2 : 1.6,
                            }}
                        />
                    </span>
                );
            })}
            <span
                className="ml-2 text-xs font-semibold"
                style={{ color: MOODS[selected].color }}
            >
                {label}
            </span>
        </div>
    );
}

interface ReviewCardProps {
    review: IHotelReviewResponse | ICabReviewResponse;
    showReferenceId?: boolean;
}

const ReviewCard = ({ review, showReferenceId = false }: ReviewCardProps) => {
    const isHotelReview = "hotelId" in review;
    const hotelReview = isHotelReview ? (review as IHotelReviewResponse) : null;
    const cabReview = !isHotelReview ? (review as ICabReviewResponse) : null;

    const reviewerName = hotelReview?.reviewerName ?? "Guest";

    const referenceId = isHotelReview
        ? hotelReview!.bookingId
        : cabReview!.rideId;

    const displayRating = hotelReview?.overallRating ?? cabReview?.rating ?? 0;

    const textContent = hotelReview?.comment ?? cabReview?.review;

    const ratedAspects = hotelReview
        ? ASPECTS.filter(
              (a) =>
                  hotelReview.ratings?.[
                      a.key as keyof IHotelReviewResponse["ratings"]
                  ] !== undefined
          )
        : [];

    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 flex-shrink-0">
                        <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-sm leading-tight">
                            {reviewerName}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {formatDistanceToNow(new Date(review.createdAt), {
                                addSuffix: true,
                            })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {showReferenceId && (
                        <span className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 rounded-full px-2 py-0.5">
                            #{referenceId.substring(0, 8)}
                        </span>
                    )}
                </div>
            </div>

            {!isHotelReview && (
                <div className="px-5 py-3 border-b border-gray-50">
                    <StarRatingDisplay rating={displayRating} size="sm" />
                </div>
            )}

            {ratedAspects.length > 0 && (
                <div className="px-5 py-3 space-y-3">
                    {ratedAspects.map(({ key, label, Icon }) => {
                        const score = hotelReview!.ratings![
                            key as keyof IHotelReviewResponse["ratings"]
                        ] as number;
                        return (
                            <div key={key} className="flex items-center gap-3">
                                <div className="w-6 flex-shrink-0">
                                    <Icon className="w-4 h-4 text-gray-400" />
                                </div>
                                <span className="text-sm text-gray-700 font-medium w-32 flex-shrink-0">
                                    {label}
                                </span>
                                <AspectMoodRow score={score} />
                            </div>
                        );
                    })}
                </div>
            )}

            {textContent && (
                <div className="px-5 pb-5 pt-3 border-t border-gray-50">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                        Guest Feedback
                    </p>
                    <div className="flex gap-2">
                        <span className="text-2xl text-gray-200 font-serif leading-none select-none mt-0.5">
                            "
                        </span>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {textContent}
                        </p>
                    </div>
                </div>
            )}

            {isHotelReview && displayRating > 0 && (
                <div className="px-5 pb-4 flex items-center gap-2">
                    <StarRatingDisplay rating={displayRating} size="sm" />
                    <span className="text-xs text-gray-400">
                        ({displayRating.toFixed(1)})
                    </span>
                </div>
            )}
        </div>
    );
};

export default ReviewCard;

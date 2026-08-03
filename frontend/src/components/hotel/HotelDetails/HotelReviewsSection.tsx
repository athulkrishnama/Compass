import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getHotelReviewsQueryOptions } from "@/queryOptions/reviewQueryOptions";
import ReviewCard from "@/components/shared/review/ReviewCard";
import StarRatingDisplay from "@/components/shared/review/StarRatingDisplay";
import Loading from "@/components/shared/loading/Loading";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Angry, Frown, Meh, Smile, Laugh } from "lucide-react";
import type { IAspectAverages } from "@/types/api/responses/reviewResponses";

interface HotelReviewsSectionProps {
    hotelId: string;
}

const ASPECTS: { key: keyof IAspectAverages; label: string }[] = [
    { key: "hospitality", label: "Hospitality" },
    { key: "staffFriendliness", label: "Staff Friendliness" },
    { key: "cleanliness", label: "Cleanliness" },
    { key: "comfort", label: "Comfort" },
    { key: "roomQuality", label: "Room Quality" },
    { key: "safety", label: "Safety" },
];

const MOODS = [
    { Icon: Angry, color: "#EF4444" },
    { Icon: Frown, color: "#F97316" },
    { Icon: Meh, color: "#EAB308" },
    { Icon: Smile, color: "#22C55E" },
    { Icon: Laugh, color: "#06B6D4" },
];

function AspectBar({ label, avg }: { label: string; avg: number }) {
    const pct = ((avg - 1) / 4) * 100;
    const moodIndex = Math.min(4, Math.round(avg) - 1);
    const mood = MOODS[moodIndex];
    const Icon = mood.Icon;

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-36 flex-shrink-0">
                {label}
            </span>
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: mood.color }}
                />
            </div>
            <div className="flex items-center gap-1 w-16 flex-shrink-0">
                <Icon
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: mood.color }}
                />
                <span
                    className="text-xs font-bold"
                    style={{ color: mood.color }}
                >
                    {avg.toFixed(1)}
                </span>
            </div>
        </div>
    );
}

const HotelReviewsSection = ({ hotelId }: HotelReviewsSectionProps) => {
    const [page, setPage] = useState(1);
    const limit = 4;

    const { data, isLoading, error } = useQuery(
        getHotelReviewsQueryOptions(hotelId, page, limit)
    );

    if (isLoading) {
        return (
            <div className="py-12 flex justify-center items-center">
                <Loading />
            </div>
        );
    }

    if (error) return null;

    const reviews = data?.data?.reviews || [];
    const total = data?.data?.total || 0;
    const averageRating = data?.data?.averageRating || 0;
    const aspectAverages = data?.data?.aspectAverages || {};
    const totalPages = Math.ceil(total / limit);

    const ratedAspects = ASPECTS.filter(
        (a) => (aspectAverages[a.key] ?? 0) > 0
    );

    if (reviews.length === 0) {
        return (
            <div className="py-12 bg-white rounded-2xl border border-gray-100 mt-10">
                <div className="text-center px-6">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                        <MessageSquare className="w-5 h-5 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        No Reviews Yet
                    </h3>
                    <p className="text-gray-500 text-sm">
                        Be the first to share your experience after staying
                        here.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-12 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        Guest Reviews
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Real reviews from verified guests
                    </p>
                </div>

                {/* Overall score */}
                <div className="flex items-center gap-4 bg-gray-50 px-5 py-3 rounded-xl border border-gray-100 flex-shrink-0">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 leading-none mb-1">
                            {averageRating.toFixed(1)}
                        </div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Out of 5
                        </div>
                    </div>
                    <div className="w-px h-12 bg-gray-200" />
                    <div>
                        <StarRatingDisplay rating={averageRating} size="md" />
                        <div className="text-sm font-medium text-gray-600 mt-1">
                            Based on {total}{" "}
                            {total === 1 ? "review" : "reviews"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Aspect averages */}
            {ratedAspects.length > 0 && (
                <div className="mb-8 p-5 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                    <h3 className="text-sm font-bold text-gray-700 mb-4">
                        Rating Breakdown
                    </h3>
                    {ratedAspects.map((a) => (
                        <AspectBar
                            key={a.key}
                            label={a.label}
                            avg={aspectAverages[a.key]!}
                        />
                    ))}
                </div>
            )}

            {/* Review cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {reviews.map((review) => (
                    <ReviewCard key={review._id} review={review} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 border-t border-gray-100 pt-6">
                    <Button
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="rounded-full font-medium"
                    >
                        Previous
                    </Button>
                    <span className="text-sm font-medium text-gray-600">
                        {page} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="rounded-full font-medium"
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};

export default HotelReviewsSection;

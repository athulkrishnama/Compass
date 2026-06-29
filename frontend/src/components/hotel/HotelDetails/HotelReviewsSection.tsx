import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getHotelReviewsQueryOptions } from "@/queryOptions/reviewQueryOptions";
import ReviewCard from "@/components/shared/review/ReviewCard";
import StarRatingDisplay from "@/components/shared/review/StarRatingDisplay";
import { Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HotelReviewsSectionProps {
    hotelId: string;
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
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (error) {
        return null; // Fail silently for reviews section on public page
    }

    const reviews = data?.data?.reviews || [];
    const total = data?.data?.total || 0;
    const averageRating = data?.data?.averageRating || 0;
    const totalPages = Math.ceil(total / limit);

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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Guest Reviews
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Real reviews from verified guests
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-gray-50 px-5 py-3 rounded-xl border border-gray-100">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 leading-none mb-1">
                            {averageRating.toFixed(1)}
                        </div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Out of 5
                        </div>
                    </div>
                    <div className="w-px h-12 bg-gray-200"></div>
                    <div>
                        <StarRatingDisplay rating={averageRating} size="md" />
                        <div className="text-sm font-medium text-gray-600 mt-1">
                            Based on {total}{" "}
                            {total === 1 ? "review" : "reviews"}
                        </div>
                    </div>
                </div>
            </div>

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

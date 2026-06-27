import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDriverReviewsQueryOptions } from "@/queryOptions/reviewQueryOptions";
import ReviewCard from "@/components/shared/review/ReviewCard";
import { Loader2 } from "lucide-react";
import StarRatingDisplay from "@/components/shared/review/StarRatingDisplay";

const DriverReviews = () => {
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading, error } = useQuery(
        getDriverReviewsQueryOptions(page, limit)
    );

    if (isLoading) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full flex justify-center items-center text-red-500">
                Failed to load reviews
            </div>
        );
    }

    const reviews = data?.data?.reviews || [];
    const total = data?.data?.total || 0;
    const averageRating = data?.data?.averageRating || 0;
    const totalPages = Math.ceil(total / limit);

    return (
        <div className="p-8 max-w-5xl mx-auto w-full">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        My Reviews
                    </h1>
                    <p className="text-gray-500">
                        See what riders are saying about you
                    </p>
                </div>

                <div className="bg-white px-6 py-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-end">
                    <span className="text-sm text-gray-500 font-medium mb-1">
                        Overall Rating
                    </span>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-gray-900">
                            {averageRating.toFixed(1)}
                        </span>
                        <StarRatingDisplay rating={averageRating} size="md" />
                    </div>
                    <span className="text-xs text-gray-400 mt-1">
                        Based on {total} reviews
                    </span>
                </div>
            </div>

            {reviews.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                        No reviews yet
                    </h3>
                    <p className="text-gray-500">
                        Complete more rides to get reviews from riders.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.map((review) => (
                        <ReviewCard
                            key={review._id}
                            review={review}
                            showReferenceId
                        />
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-10">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm font-medium text-gray-600">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default DriverReviews;

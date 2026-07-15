import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    getAdminCabReviewsQueryOptions,
    getAdminHotelReviewsQueryOptions,
} from "@/queryOptions/reviewQueryOptions";
import ReviewCard from "@/components/shared/review/ReviewCard";
import Loading from "@/components/shared/loading/Loading";
import type { IReviewAdminFilters } from "@/types/api/requests/reviewRequests";

const AdminReviews = () => {
    const [activeTab, setActiveTab] = useState<"cab" | "hotel">("cab");

    // Filters
    const [page, setPage] = useState(1);
    const limit = 12;
    const [filters, setFilters] = useState<IReviewAdminFilters>({});

    const { data: cabData, isLoading: isCabLoading } = useQuery({
        ...getAdminCabReviewsQueryOptions({ ...filters, page, limit }),
        enabled: activeTab === "cab",
    });

    const { data: hotelData, isLoading: isHotelLoading } = useQuery({
        ...getAdminHotelReviewsQueryOptions({ ...filters, page, limit }),
        enabled: activeTab === "hotel",
    });

    const isLoading = activeTab === "cab" ? isCabLoading : isHotelLoading;
    const data = activeTab === "cab" ? cabData : hotelData;
    const reviews = data?.data?.reviews || [];
    const total = data?.data?.total || 0;
    const totalPages = Math.ceil(total / limit);

    return (
        <div className="p-8 w-full max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Platform Reviews
                </h1>
                <p className="text-gray-500">
                    Monitor and manage all reviews across the platform
                </p>
            </div>

            <div className="flex gap-4 mb-6 border-b border-gray-200">
                <button
                    className={`pb-3 px-1 font-medium transition-colors relative ${
                        activeTab === "cab"
                            ? "text-black"
                            : "text-gray-500 hover:text-gray-800"
                    }`}
                    onClick={() => {
                        setActiveTab("cab");
                        setPage(1);
                    }}
                >
                    Cab Reviews
                    {activeTab === "cab" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-t-full" />
                    )}
                </button>
                <button
                    className={`pb-3 px-1 font-medium transition-colors relative ${
                        activeTab === "hotel"
                            ? "text-black"
                            : "text-gray-500 hover:text-gray-800"
                    }`}
                    onClick={() => {
                        setActiveTab("hotel");
                        setPage(1);
                    }}
                >
                    Hotel Reviews
                    {activeTab === "hotel" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-t-full" />
                    )}
                </button>
            </div>

            {/* Basic Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-wrap gap-4 items-end">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Rating
                    </label>
                    <select
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none"
                        value={filters.rating || ""}
                        onChange={(e) => {
                            setFilters((prev) => ({
                                ...prev,
                                rating: e.target.value
                                    ? parseInt(e.target.value)
                                    : undefined,
                            }));
                            setPage(1);
                        }}
                    >
                        <option value="">All Ratings</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="w-full py-20 flex justify-center items-center">
                    <Loading />
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                        No reviews found
                    </h3>
                    <p className="text-gray-500">
                        There are no reviews matching the current filters.
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.map((review) => (
                            <ReviewCard
                                key={review._id}
                                review={review}
                                showReferenceId
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-10">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage((p) => p - 1)}
                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 shadow-sm transition-all"
                            >
                                Previous
                            </button>
                            <span className="text-sm font-medium text-gray-600">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage((p) => p + 1)}
                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 shadow-sm transition-all"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminReviews;

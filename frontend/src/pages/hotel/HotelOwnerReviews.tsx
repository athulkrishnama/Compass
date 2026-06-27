import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getHotelReviewsQueryOptions } from "@/queryOptions/reviewQueryOptions";
import { createGetHotelsByUserIdQueryOptions } from "@/queryOptions/hotelQueryOptions";
import ReviewCard from "@/components/shared/review/ReviewCard";
import { Loader2 } from "lucide-react";

const HotelOwnerReviews = () => {
    const [page, setPage] = useState(1);
    const [selectedHotelId, setSelectedHotelId] = useState<string>("");
    const limit = 10;

    const { data: hotelsData, isLoading: hotelsLoading } = useQuery(
        createGetHotelsByUserIdQueryOptions()
    );

    const hotels = hotelsData?.data?.hotels || [];

    useEffect(() => {
        if (hotels.length > 0 && !selectedHotelId) {
            setSelectedHotelId(hotels[0].id);
        }
    }, [hotels, selectedHotelId]);

    const { data, isLoading, error } = useQuery({
        ...getHotelReviewsQueryOptions(selectedHotelId, page, limit),
        enabled: !!selectedHotelId,
    });

    if (hotelsLoading) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
            </div>
        );
    }

    if (hotels.length === 0) {
        return (
            <div className="p-8 max-w-5xl mx-auto w-full">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Hotel Reviews
                    </h1>
                </div>
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                        No Hotels Yet
                    </h3>
                    <p className="text-gray-500">
                        You need to add a hotel before you can receive reviews.
                    </p>
                </div>
            </div>
        );
    }

    const reviews = data?.data?.reviews || [];
    const total = data?.data?.total || 0;
    const totalPages = Math.ceil(total / limit);

    return (
        <div className="p-8 max-w-5xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Hotel Reviews
                    </h1>
                    <p className="text-gray-500">
                        See what guests are saying about your properties
                    </p>
                </div>

                {hotels.length > 1 && (
                    <div className="flex flex-col gap-1.5 min-w-[200px]">
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Select Hotel
                        </label>
                        <select
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none"
                            value={selectedHotelId}
                            onChange={(e) => {
                                setSelectedHotelId(e.target.value);
                                setPage(1);
                            }}
                        >
                            {hotels.map((hotel) => (
                                <option key={hotel.id} value={hotel.id}>
                                    {hotel.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {isLoading ? (
                <div className="w-full py-20 flex justify-center items-center">
                    <Loader2 className="w-8 h-8 animate-spin text-black" />
                </div>
            ) : error ? (
                <div className="w-full py-20 flex justify-center items-center text-red-500">
                    Failed to load reviews
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                        No reviews yet
                    </h3>
                    <p className="text-gray-500">
                        Your guests haven't left any reviews for this hotel yet.
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

export default HotelOwnerReviews;

import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getHotelReviewsQueryOptions } from "@/queryOptions/reviewQueryOptions";
import { createGetHotelsByUserIdQueryOptions } from "@/queryOptions/hotelQueryOptions";
import ReviewCard from "@/components/shared/review/ReviewCard";
import { Loader2 } from "lucide-react";
import translationKey from "@/utils/i18n/translationKey";
import { Angry, Frown, Meh, Smile, Laugh } from "lucide-react";
import type { IAspectAverages } from "@/types/api/responses/reviewResponses";

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
    const moodIndex = Math.min(4, Math.max(0, Math.round(avg) - 1));
    const mood = MOODS[moodIndex];
    const Icon = mood.Icon;

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-36 flex-shrink-0">
                {label}
            </span>
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
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

const HotelOwnerReviews = () => {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [selectedHotelId, setSelectedHotelId] = useState<string>("");
    const limit = 10;

    const { data: hotelsData, isLoading: hotelsLoading } = useQuery(
        createGetHotelsByUserIdQueryOptions()
    );

    const hotels = useMemo(() => hotelsData?.data?.hotels || [], [hotelsData]);

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
                        {t(translationKey.hotelOwnerReviews.title)}
                    </h1>
                </div>
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {t(translationKey.hotelOwnerReviews.noHotelsYet)}
                    </h3>
                    <p className="text-gray-500">
                        {t(translationKey.hotelOwnerReviews.addHotelFirst)}
                    </p>
                </div>
            </div>
        );
    }

    const reviews = data?.data?.reviews || [];
    const total = data?.data?.total || 0;
    const aspectAverages = data?.data?.aspectAverages || {};
    const totalPages = Math.ceil(total / limit);

    const ratedAspects = ASPECTS.filter(
        (a) => (aspectAverages[a.key] ?? 0) > 0
    );

    return (
        <div className="p-8 max-w-5xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {t(translationKey.hotelOwnerReviews.title)}
                    </h1>
                    <p className="text-gray-500">
                        {t(translationKey.hotelOwnerReviews.subtitle)}
                    </p>
                </div>

                {hotels.length > 1 && (
                    <div className="flex flex-col gap-1.5 min-w-[200px]">
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            {t(translationKey.hotelOwnerReviews.selectHotel)}
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

            {/* Content area */}
            {isLoading ? (
                <div className="w-full py-20 flex justify-center items-center">
                    <Loader2 className="w-8 h-8 animate-spin text-black" />
                </div>
            ) : error ? (
                <div className="w-full py-20 flex justify-center items-center text-red-500">
                    {t(translationKey.hotelOwnerReviews.failedToLoad)}
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {t(translationKey.hotelOwnerReviews.noReviewsYet)}
                    </h3>
                    <p className="text-gray-500">
                        {t(
                            translationKey.hotelOwnerReviews
                                .noReviewsYetDescription
                        )}
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-8">
                    {/* Rating Breakdown block */}
                    {ratedAspects.length > 0 && (
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">
                                Overall Rating Breakdown
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                {ratedAspects.map((a) => (
                                    <AspectBar
                                        key={a.key}
                                        label={a.label}
                                        avg={aspectAverages[a.key]!}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Review cards grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reviews.map((review) => (
                            <ReviewCard
                                key={review._id}
                                review={review}
                                showReferenceId
                            />
                        ))}
                    </div>
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-10">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                    >
                        {t(translationKey.button.previous)}
                    </button>
                    <span className="text-sm font-medium text-gray-600">
                        {t(translationKey.hotelOwnerReviews.pageOf, {
                            page,
                            totalPages,
                        })}
                    </span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                    >
                        {t(translationKey.button.next)}
                    </button>
                </div>
            )}
        </div>
    );
};

export default HotelOwnerReviews;

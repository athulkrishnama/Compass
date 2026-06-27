import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
    Clock,
    Calendar,
    IndianRupee,
    CreditCard,
    AlertCircle,
} from "lucide-react";
import { getRiderPastTripsQueryOptions } from "@/queryOptions/rideQueryOptions";
import Pagination from "@/components/shared/Pagination/Pagination";
import translationKey from "@/utils/i18n/translationKey";
import { useReverseGeocode } from "@/hooks/useReverseGeocode";
import type { IRiderPastTripResponseDTO } from "@/types/api/responses/rideResponses";
import { Star } from "lucide-react";
import ReviewFormModal from "@/components/shared/review/ReviewFormModal";
import {
    createCabReview,
    checkCabReviewEligibility,
} from "@/services/api/reviewApiService";
import { toast } from "sonner";

const TripItem = ({
    trip,
    index,
}: {
    trip: IRiderPastTripResponseDTO;
    index: number;
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { address: pickupAddress } = useReverseGeocode(trip.pickup_point);
    const { address: dropoffAddress } = useReverseGeocode(trip.dropoff_point);

    const isCancelled = trip.status === "cancelled";
    const isPaymentPending = !isCancelled && trip.paymentStatus !== "SUCCESS";
    const durationMins = Math.ceil(trip.time / 60);

    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);

    const handleViewRide = () => {
        navigate({
            to: `/traveler/cab/ride/${trip._id}`,
        });
    };

    const handleReviewClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            setIsCheckingEligibility(true);
            const res = await checkCabReviewEligibility(trip._id);
            if (res.data?.eligible) {
                setIsReviewModalOpen(true);
            } else if (res.data?.alreadyReviewed) {
                toast.info("You have already reviewed this ride.");
            } else {
                toast.error(
                    res.data?.reason || "Not eligible to review this ride."
                );
            }
        } catch {
            toast.error("Failed to check review eligibility.");
        } finally {
            setIsCheckingEligibility(false);
        }
    };

    const handleReviewSubmit = async (data: {
        rating: number;
        review: string;
    }) => {
        await createCabReview({
            rideId: trip._id,
            rating: data.rating,
            review: data.review,
        });
        toast.success("Review submitted successfully!");
    };

    return (
        <motion.div
            onClick={handleViewRide}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex flex-col sm:flex-row bg-white border border-black/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow gap-4 h-full cursor-pointer"
        >
            <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-sm text-gray-500 gap-4">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {trip.date}
                        </span>
                        {!isCancelled && (
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {durationMins} min
                            </span>
                        )}
                        {isCancelled && (
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700 uppercase tracking-wider">
                                {t(translationKey.bookingStatus.CANCELLED)}
                            </span>
                        )}
                    </div>
                    <span className="flex items-center gap-1 font-semibold text-black">
                        <IndianRupee className="w-4 h-4" />
                        {trip.selected_fare.fare}
                    </span>
                </div>

                <div className="flex flex-col gap-3 relative">
                    <div className="absolute left-[4px] top-[14px] bottom-[14px] w-0.5 bg-gray-200"></div>

                    <div className="flex gap-3 relative">
                        <div className="w-2.5 h-2.5 rounded-full bg-black shrink-0 mt-1.5 z-10"></div>
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                {t(translationKey.cabHome.pickup)}
                            </p>
                            <p className="text-sm font-medium text-black line-clamp-1">
                                {pickupAddress || "Loading..."}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 relative">
                        <div className="w-2.5 h-2.5 rounded-full border-2 border-black bg-white shrink-0 mt-1.5 z-10"></div>
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                {t(translationKey.cabHome.dropoff)}
                            </p>
                            <p className="text-sm font-medium text-black line-clamp-1">
                                {dropoffAddress || "Loading..."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {isPaymentPending ? (
                <div className="flex flex-col justify-center border-t sm:border-t-0 sm:border-l border-black/10 pt-4 sm:pt-0 sm:pl-6 sm:w-48 gap-3">
                    <div className="flex items-center gap-1.5 text-amber-600 text-sm font-medium">
                        <AlertCircle className="w-4 h-4" />
                        {t(translationKey.cabHistory.paymentPending)}
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleViewRide();
                        }}
                        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <CreditCard className="w-4 h-4" />
                        {t(translationKey.cabHistory.retryPayment)}
                    </button>
                </div>
            ) : trip.status === "completed" ? (
                <div className="flex flex-col justify-center border-t sm:border-t-0 sm:border-l border-black/10 pt-4 sm:pt-0 sm:pl-6 sm:w-48 gap-3">
                    <button
                        disabled={isCheckingEligibility}
                        onClick={handleReviewClick}
                        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 border border-black/10 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Star className="w-4 h-4" />
                        Rate Ride
                    </button>
                </div>
            ) : null}

            <ReviewFormModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                onSubmit={handleReviewSubmit}
                title="Rate Your Ride"
                subtitle="How was your trip with your driver?"
            />
        </motion.div>
    );
};

const CabHistory = () => {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const limit = 6;

    const { data: pastTripsResponse, isLoading } = useQuery(
        getRiderPastTripsQueryOptions(page, limit)
    );

    const trips = pastTripsResponse?.data?.trips || [];
    const total = pastTripsResponse?.data?.total || 0;
    const totalPages = Math.ceil(total / limit);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-black tracking-tight mb-2">
                        {t(translationKey.cabHistory.title)}
                    </h1>
                    <p className="text-gray-500">
                        {t(translationKey.cabHistory.subtitle)}
                    </p>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="h-40 bg-white rounded-xl border border-black/10 animate-pulse"
                            ></div>
                        ))}
                    </div>
                ) : trips.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {trips.map((trip, index) => (
                                <TripItem
                                    key={trip._id}
                                    trip={trip}
                                    index={index}
                                />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                setPage={setPage}
                            />
                        )}
                    </>
                ) : (
                    <div className="bg-white border border-black/10 rounded-xl p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-black mb-2">
                            {t(translationKey.cabHistory.noTrips)}
                        </h3>
                        <p className="text-gray-500">
                            {t(translationKey.cabHistory.noTripsDescription)}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CabHistory;

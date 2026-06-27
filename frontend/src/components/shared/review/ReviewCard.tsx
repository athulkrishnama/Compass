import { formatDistanceToNow } from "date-fns";
import { User } from "lucide-react";
import StarRatingDisplay from "./StarRatingDisplay";
import type {
    IHotelReviewResponse,
    ICabReviewResponse,
} from "@/types/api/responses/reviewResponses";

interface ReviewCardProps {
    review: IHotelReviewResponse | ICabReviewResponse;
    showReferenceId?: boolean; // Whether to show bookingId or rideId
}

const ReviewCard = ({ review, showReferenceId = false }: ReviewCardProps) => {
    const isHotelReview = "hotelId" in review;
    const reviewerName = isHotelReview
        ? (review as IHotelReviewResponse).reviewerName
        : "Rider";

    const referenceId = isHotelReview
        ? (review as IHotelReviewResponse).bookingId
        : (review as ICabReviewResponse).rideId;

    return (
        <div className="bg-white border border-black/10 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-black/5">
                        <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900">
                            {reviewerName || "Guest"}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                            <StarRatingDisplay
                                rating={review.rating}
                                size="sm"
                            />
                            <span className="text-xs text-gray-500">
                                •{" "}
                                {formatDistanceToNow(
                                    new Date(review.createdAt),
                                    { addSuffix: true }
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                {showReferenceId && (
                    <div className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                        ID: {referenceId.substring(0, 8)}...
                    </div>
                )}
            </div>

            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {review.review}
            </p>
        </div>
    );
};

export default ReviewCard;

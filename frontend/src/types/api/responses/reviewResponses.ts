export interface IEligibilityResponse {
    eligible: boolean;
    reason?: string;
    alreadyReviewed?: boolean;
}

export interface IReviewAspectRatings {
    hospitality?: number;
    staffFriendliness?: number;
    cleanliness?: number;
    comfort?: number;
    roomQuality?: number;
    safety?: number;
}

export interface IReviewResponse {
    _id: string;
    ratings: IReviewAspectRatings;
    comment?: string;
    overallRating?: number;
    createdAt: string;
    updatedAt: string;
}

export interface ICabReviewResponse {
    _id: string;
    rideId: string;
    riderId: string;
    driverId: string;
    cabId: string;
    rating: number;
    review: string;
    createdAt: string;
    updatedAt: string;
}

export interface IHotelReviewResponse extends IReviewResponse {
    bookingId: string;
    hotelId: string;
    reviewerId: string;
    reviewerName?: string;
}

export interface ICabReviewsListResponse {
    reviews: ICabReviewResponse[];
    total: number;
    averageRating?: number;
}

export interface IHotelReviewsListResponse {
    reviews: IHotelReviewResponse[];
    total: number;
    averageRating?: number;
}

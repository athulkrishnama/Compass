export interface IEligibilityResponse {
    eligible: boolean;
    reason?: string;
    alreadyReviewed?: boolean;
}

export interface IReviewResponse {
    _id: string;
    rating: number;
    review: string;
    createdAt: string;
    updatedAt: string;
}

export interface ICabReviewResponse extends IReviewResponse {
    rideId: string;
    riderId: string;
    driverId: string;
    cabId: string;
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

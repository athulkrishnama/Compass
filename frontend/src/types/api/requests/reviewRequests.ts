export interface ICreateCabReviewRequestDTO {
    rideId: string;
    rating: number;
    review: string;
}

export interface IReviewAspectRatings {
    hospitality?: number;
    staffFriendliness?: number;
    cleanliness?: number;
    comfort?: number;
    roomQuality?: number;
    safety?: number;
}

export interface ICreateHotelReviewRequestDTO {
    bookingId: string;
    ratings: IReviewAspectRatings;
    comment?: string;
}

export interface IReviewAdminFilters {
    page?: number;
    limit?: number;
    minRating?: number;
    maxRating?: number;
    search?: string;
    fromDate?: string;
    toDate?: string;
}

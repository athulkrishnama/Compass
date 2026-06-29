export interface ICreateCabReviewRequestDTO {
    rideId: string;
    rating: number;
    review: string;
}

export interface ICreateHotelReviewRequestDTO {
    bookingId: string;
    rating: number;
    review: string;
}

export interface IReviewAdminFilters {
    page?: number;
    limit?: number;
    rating?: number;
    search?: string;
    fromDate?: string;
    toDate?: string;
}

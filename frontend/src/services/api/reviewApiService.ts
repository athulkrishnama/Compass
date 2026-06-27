import { axiosInstance } from "@/axios/instance";
import {
    CAB_REVIEW_ROUTES,
    HOTEL_REVIEW_ROUTES,
} from "@/constants/routes/reviewRoutes";
import type {
    ICreateCabReviewRequestDTO,
    ICreateHotelReviewRequestDTO,
    IReviewAdminFilters,
} from "@/types/api/requests/reviewRequests";
import type {
    IEligibilityResponse,
    ICabReviewsListResponse,
    IHotelReviewsListResponse,
} from "@/types/api/responses/reviewResponses";
import type { HttpResponse } from "@/types/api/responseType";
import { AxiosError } from "axios";

const handleError = (error: unknown): never => {
    if (error instanceof AxiosError) {
        throw new Error(error.response?.data.message || "Something went wrong");
    }
    throw new Error("Something went wrong");
};

// --- Cab Reviews ---

export async function createCabReview(
    data: ICreateCabReviewRequestDTO
): Promise<HttpResponse<Record<string, never>>> {
    try {
        const response = await axiosInstance.post(
            CAB_REVIEW_ROUTES.CREATE,
            data
        );
        return response.data;
    } catch (error) {
        return handleError(error);
    }
}

export async function checkCabReviewEligibility(
    rideId: string
): Promise<HttpResponse<IEligibilityResponse>> {
    try {
        const response = await axiosInstance.get(
            `${CAB_REVIEW_ROUTES.ELIGIBILITY}/${rideId}`
        );
        return response.data;
    } catch (error) {
        return handleError(error);
    }
}

export async function getDriverReviews(
    page: number = 1,
    limit: number = 10
): Promise<HttpResponse<ICabReviewsListResponse>> {
    try {
        const response = await axiosInstance.get(
            `${CAB_REVIEW_ROUTES.DRIVER_REVIEWS}?page=${page}&limit=${limit}`
        );
        return response.data;
    } catch (error) {
        return handleError(error);
    }
}

export async function getAdminCabReviews(
    filters: IReviewAdminFilters
): Promise<HttpResponse<ICabReviewsListResponse>> {
    try {
        const response = await axiosInstance.get(
            CAB_REVIEW_ROUTES.ADMIN_REVIEWS,
            {
                params: filters,
            }
        );
        return response.data;
    } catch (error) {
        return handleError(error);
    }
}

// --- Hotel Reviews ---

export async function createHotelReview(
    data: ICreateHotelReviewRequestDTO
): Promise<HttpResponse<Record<string, never>>> {
    try {
        const response = await axiosInstance.post(
            HOTEL_REVIEW_ROUTES.CREATE,
            data
        );
        return response.data;
    } catch (error) {
        return handleError(error);
    }
}

export async function checkHotelReviewEligibility(
    bookingId: string
): Promise<HttpResponse<IEligibilityResponse>> {
    try {
        const response = await axiosInstance.get(
            `${HOTEL_REVIEW_ROUTES.ELIGIBILITY}/${bookingId}`
        );
        return response.data;
    } catch (error) {
        return handleError(error);
    }
}

export async function getHotelReviews(
    hotelId: string,
    page: number = 1,
    limit: number = 10
): Promise<HttpResponse<IHotelReviewsListResponse>> {
    try {
        const response = await axiosInstance.get(
            `${HOTEL_REVIEW_ROUTES.HOTEL_REVIEWS}/${hotelId}?page=${page}&limit=${limit}`
        );
        return response.data;
    } catch (error) {
        return handleError(error);
    }
}

export async function getOwnerHotelReviews(
    page: number = 1,
    limit: number = 10
): Promise<HttpResponse<IHotelReviewsListResponse>> {
    try {
        const response = await axiosInstance.get(
            `${HOTEL_REVIEW_ROUTES.OWNER_REVIEWS}?page=${page}&limit=${limit}`
        );
        return response.data;
    } catch (error) {
        return handleError(error);
    }
}

export async function getAdminHotelReviews(
    filters: IReviewAdminFilters
): Promise<HttpResponse<IHotelReviewsListResponse>> {
    try {
        const response = await axiosInstance.get(
            HOTEL_REVIEW_ROUTES.ADMIN_REVIEWS,
            {
                params: filters,
            }
        );
        return response.data;
    } catch (error) {
        return handleError(error);
    }
}

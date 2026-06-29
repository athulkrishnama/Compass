import { queryOptions } from "@tanstack/react-query";
import {
    checkCabReviewEligibility,
    getDriverReviews,
    getAdminCabReviews,
    checkHotelReviewEligibility,
    getHotelReviews,
    getOwnerHotelReviews,
    getAdminHotelReviews,
} from "@/services/api/reviewApiService";
import type { IReviewAdminFilters } from "@/types/api/requests/reviewRequests";

export const cabReviewKeys = {
    all: ["cabReviews"] as const,
    eligibility: (rideId: string) =>
        [...cabReviewKeys.all, "eligibility", rideId] as const,
    driver: (page: number, limit: number) =>
        [...cabReviewKeys.all, "driver", page, limit] as const,
    admin: (filters: IReviewAdminFilters) =>
        [...cabReviewKeys.all, "admin", filters] as const,
};

export const hotelReviewKeys = {
    all: ["hotelReviews"] as const,
    eligibility: (bookingId: string) =>
        [...hotelReviewKeys.all, "eligibility", bookingId] as const,
    hotel: (hotelId: string, page: number, limit: number) =>
        [...hotelReviewKeys.all, "hotel", hotelId, page, limit] as const,
    owner: (page: number, limit: number) =>
        [...hotelReviewKeys.all, "owner", page, limit] as const,
    admin: (filters: IReviewAdminFilters) =>
        [...hotelReviewKeys.all, "admin", filters] as const,
};

export const getCabReviewEligibilityQueryOptions = (rideId: string) =>
    queryOptions({
        queryKey: cabReviewKeys.eligibility(rideId),
        queryFn: () => checkCabReviewEligibility(rideId),
        staleTime: 5 * 60 * 1000,
    });

export const getDriverReviewsQueryOptions = (page: number, limit: number) =>
    queryOptions({
        queryKey: cabReviewKeys.driver(page, limit),
        queryFn: () => getDriverReviews(page, limit),
    });

export const getAdminCabReviewsQueryOptions = (filters: IReviewAdminFilters) =>
    queryOptions({
        queryKey: cabReviewKeys.admin(filters),
        queryFn: () => getAdminCabReviews(filters),
    });

export const getHotelReviewEligibilityQueryOptions = (bookingId: string) =>
    queryOptions({
        queryKey: hotelReviewKeys.eligibility(bookingId),
        queryFn: () => checkHotelReviewEligibility(bookingId),
        staleTime: 5 * 60 * 1000,
    });

export const getHotelReviewsQueryOptions = (
    hotelId: string,
    page: number,
    limit: number
) =>
    queryOptions({
        queryKey: hotelReviewKeys.hotel(hotelId, page, limit),
        queryFn: () => getHotelReviews(hotelId, page, limit),
    });

export const getOwnerHotelReviewsQueryOptions = (page: number, limit: number) =>
    queryOptions({
        queryKey: hotelReviewKeys.owner(page, limit),
        queryFn: () => getOwnerHotelReviews(page, limit),
    });

export const getAdminHotelReviewsQueryOptions = (
    filters: IReviewAdminFilters
) =>
    queryOptions({
        queryKey: hotelReviewKeys.admin(filters),
        queryFn: () => getAdminHotelReviews(filters),
    });

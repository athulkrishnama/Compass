import {
    getTravelerUpcomingBookings,
    getTravelerOngoingBookings,
    getTravelerCompletedBookings,
    getBookingDetails,
    cancelBooking,
} from "@/services/api/booking.ApiService";
import type { ITravelerBookingListingResponseDTO } from "@/types/api/responses/bookingResponse";
import type { IBookingDetailsResponseDTO } from "@/types/api/responses/bookingResponse";
import type { HttpResponse } from "@/types/api/responseType";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys/queryKeys";

export function createGetUpcomingBookingsInfiniteQueryOptions() {
    return infiniteQueryOptions<
        HttpResponse<ITravelerBookingListingResponseDTO>,
        Error
    >({
        queryKey: [QUERY_KEYS.BOOKING, "upcoming"],
        queryFn: ({ pageParam = 1 }) =>
            getTravelerUpcomingBookings(pageParam as number),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage?.data?.bookings?.length === 0) {
                return undefined;
            }
            return allPages.length + 1;
        },
        initialPageParam: 1,
    });
}

export function createGetOngoingBookingsInfiniteQueryOptions() {
    return infiniteQueryOptions<
        HttpResponse<ITravelerBookingListingResponseDTO>,
        Error
    >({
        queryKey: [QUERY_KEYS.BOOKING, "ongoing"],
        queryFn: ({ pageParam = 1 }) =>
            getTravelerOngoingBookings(pageParam as number),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage?.data?.bookings?.length === 0) {
                return undefined;
            }
            return allPages.length + 1;
        },
        initialPageParam: 1,
    });
}

export function createGetCompletedBookingsInfiniteQueryOptions() {
    return infiniteQueryOptions<
        HttpResponse<ITravelerBookingListingResponseDTO>,
        Error
    >({
        queryKey: [QUERY_KEYS.BOOKING, "completed"],
        queryFn: ({ pageParam = 1 }) =>
            getTravelerCompletedBookings(pageParam as number),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage?.data?.bookings?.length === 0) {
                return undefined;
            }
            return allPages.length + 1;
        },
        initialPageParam: 1,
    });
}

export function createGetBookingDetailsQueryOptions(bookingId: string) {
    return queryOptions<HttpResponse<IBookingDetailsResponseDTO>, Error>({
        queryKey: [QUERY_KEYS.BOOKING_DETAILS, bookingId],
        queryFn: () => getBookingDetails(bookingId),
    });
}

export function createCancelBookingMutationOptions(bookingId: string) {
    return {
        mutationFn: () => cancelBooking(bookingId),
    };
}

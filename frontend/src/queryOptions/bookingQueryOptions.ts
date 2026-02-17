import {
    getTravelerUpcomingBookings,
    getTravelerCompletedBookings,
} from "@/services/api/booking.ApiService";
import type { ITravelerBookingListingResponseDTO } from "@/types/api/responses/bookingResponse";
import type { HttpResponse } from "@/types/api/responseType";
import { infiniteQueryOptions } from "@tanstack/react-query";
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

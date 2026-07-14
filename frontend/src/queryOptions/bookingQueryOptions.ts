import {
    getTravelerUpcomingBookings,
    getTravelerOngoingBookings,
    getTravelerCompletedBookings,
    getBookingDetails,
    cancelBooking,
} from "@/services/api/booking.ApiService";
import {
    getHotelBookings,
    getAvailableRooms,
    checkInBooking,
    checkOutBooking,
    getHotelReport,
} from "@/services/api/bookingService";
import type { IAvailableRoomsResponseDTO } from "@/types/booking";
import type { ITravelerBookingListingResponseDTO } from "@/types/api/responses/bookingResponse";
import type { IBookingDetailsResponseDTO } from "@/types/api/responses/bookingResponse";
import type { IHotelBookingListingResponseDTO } from "@/types/api/responses/bookingResponse";
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

export function createGetHotelBookingsQueryOptions(
    hotelId: string,
    params: {
        pageNo: number;
        roomVariantId?: string;
        status?: string;
        search?: string;
    }
) {
    return queryOptions<HttpResponse<IHotelBookingListingResponseDTO>, Error>({
        queryKey: [QUERY_KEYS.HOTEL_BOOKINGS, hotelId, params],
        queryFn: () => getHotelBookings(hotelId, params),
    });
}

export function createGetAvailableRoomsQueryOptions(
    hotelId: string,
    bookingId: string
) {
    return queryOptions<IAvailableRoomsResponseDTO, Error>({
        queryKey: [QUERY_KEYS.AVAILABLE_ROOMS, hotelId, bookingId],
        queryFn: () => getAvailableRooms(hotelId, bookingId),
    });
}

export function createCheckInMutationOptions() {
    return {
        mutationFn: (data: {
            bookingId: string;
            hotelId: string;
            roomNumbers?: number[];
        }) => checkInBooking(data.bookingId, data.hotelId, data.roomNumbers),
    };
}

export function createCheckOutMutationOptions() {
    return {
        mutationFn: (data: { bookingId: string; hotelId: string }) =>
            checkOutBooking(data.bookingId, data.hotelId),
    };
}

export function createGetHotelReportQueryOptions(
    hotelId: string,
    params: Parameters<typeof getHotelReport>[1]
) {
    return queryOptions({
        queryKey: [QUERY_KEYS.HOTEL_REPORT, hotelId, params],
        queryFn: () => getHotelReport(hotelId, params),
    });
}

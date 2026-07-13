import {
    createHotel,
    getHotelsByUserId,
    getHotelById,
    updateHotel,
    deleteHotelImage,
    searchHotels,
} from "@/services/api/hotel.ApiService";
import type { IGetHotelsByUserIdResponse } from "@/types/api/responses/getHotelsByUserId";
import type { IGetHotelByIdResponse } from "@/types/api/responses/getHotelById";
import type { HttpResponse } from "@/types/api/responseType";
import {
    infiniteQueryOptions,
    mutationOptions,
    queryOptions,
} from "@tanstack/react-query";
import type {
    IHotelSearchRequestDTO,
    IHotelSearchResponseDTO,
} from "@/types/api/responses/hotelSearchResponse";
import { QUERY_KEYS } from "@/constants/queryKeys/queryKeys";

export function createHotelMutatationOptions() {
    return mutationOptions<HttpResponse<object>, Error, FormData>({
        mutationFn: createHotel,
    });
}

export function createGetHotelsByUserIdQueryOptions() {
    return queryOptions<HttpResponse<IGetHotelsByUserIdResponse>, Error>({
        queryKey: [QUERY_KEYS.HOTEL],
        queryFn: getHotelsByUserId,
    });
}

export function createGetHotelByIdQueryOptions(hotelId: string) {
    return queryOptions<HttpResponse<IGetHotelByIdResponse>, Error>({
        queryKey: [QUERY_KEYS.HOTEL, hotelId],
        queryFn: () => getHotelById(hotelId),
    });
}

export function createUpdateHotelMutationOptions() {
    return mutationOptions<
        HttpResponse<object>,
        Error,
        { id: string; data: FormData }
    >({
        mutationFn: updateHotel,
    });
}

export function createDeleteHotelImageMutationOptions() {
    return mutationOptions<
        HttpResponse<object>,
        Error,
        { id: string; index: number }
    >({
        mutationFn: deleteHotelImage,
    });
}

export function createSearchHotelQueryOptions(filter: IHotelSearchRequestDTO) {
    return queryOptions<HttpResponse<IHotelSearchResponseDTO>, Error>({
        queryKey: [QUERY_KEYS.HOTEL, filter],
        queryFn: () => searchHotels(filter),
    });
}
export function createSearchNearbyHotelsQueryOptions(
    city: [number, number],
    proximityRadius: number
) {
    return queryOptions<HttpResponse<IHotelSearchResponseDTO>, Error>({
        queryKey: [QUERY_KEYS.HOTEL_SEARCH, "nearby", city, proximityRadius],
        queryFn: () =>
            searchHotels({
                city,
                proximityRadius,
                pageNo: 1,
                guests: 1,
            } as IHotelSearchRequestDTO),
    });
}

export function createSearchHotelInfiniteQueryOptions(
    filter: Omit<IHotelSearchRequestDTO, "pageNo">
) {
    return infiniteQueryOptions<HttpResponse<IHotelSearchResponseDTO>, Error>({
        queryKey: [QUERY_KEYS.HOTEL_SEARCH, filter],
        queryFn: ({ pageParam = 1 }) =>
            searchHotels({ ...filter, pageNo: pageParam as number }),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage?.data?.hotels?.length === 0) {
                return undefined;
            }
            return allPages.length + 1;
        },
        initialPageParam: 1,
    });
}

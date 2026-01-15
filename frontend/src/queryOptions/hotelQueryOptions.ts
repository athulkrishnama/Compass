import {
    createHotel,
    getHotelsByUserId,
    getHotelById,
    updateHotel,
    deleteHotelImage,
} from "@/services/api/hotel.ApiService";
import type { IGetHotelsByUserIdResponse } from "@/types/api/responses/getHotelsByUserId";
import type { IGetHotelByIdResponse } from "@/types/api/responses/getHotelById";
import type { HttpResponse } from "@/types/api/responseType";
import { mutationOptions, queryOptions } from "@tanstack/react-query";

export function createHotelMutatationOptions() {
    return mutationOptions<HttpResponse<object>, Error, FormData>({
        mutationFn: createHotel,
    });
}

export function createGetHotelsByUserIdQueryOptions() {
    return queryOptions<HttpResponse<IGetHotelsByUserIdResponse>, Error>({
        queryKey: ["hotels"],
        queryFn: getHotelsByUserId,
    });
}

export function createGetHotelByIdQueryOptions(hotelId: string) {
    return queryOptions<HttpResponse<IGetHotelByIdResponse>, Error>({
        queryKey: ["hotel", hotelId],
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

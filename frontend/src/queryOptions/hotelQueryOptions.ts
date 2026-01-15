import {
    createHotel,
    getHotelsByUserId,
} from "@/services/api/hotel.ApiService";
import type { IGetHotelsByUserIdResponse } from "@/types/api/responses/getHotelsByUserId";
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

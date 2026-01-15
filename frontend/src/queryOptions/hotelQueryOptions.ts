import { createHotel } from "@/services/api/hote.ApiService";
import type { HttpResponse } from "@/types/api/responseType";
import { mutationOptions } from "@tanstack/react-query";

export function createHotelMutatationOptions() {
    return mutationOptions<HttpResponse<object>, Error, FormData>({
        mutationFn: createHotel,
    });
}

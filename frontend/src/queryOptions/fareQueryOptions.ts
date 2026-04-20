import { QUERY_KEYS } from "@/constants/queryKeys/queryKeys";
import { calculateFare } from "@/services/api/fareApiService";
import {
    type ICalculateFareRequestDTO,
    type ICalculateFareResponseDTO,
} from "@/types/api/requests/fareRequests";
import type { HttpResponse } from "@/types/api/responseType";
import { queryOptions } from "@tanstack/react-query";
export function createCalculateFareQueryOptions(
    data: ICalculateFareRequestDTO
) {
    return queryOptions<HttpResponse<ICalculateFareResponseDTO>, Error>({
        queryKey: [QUERY_KEYS.FARE_CALCULATE, data],
        queryFn: () => calculateFare(data),
        retry: 1,
        staleTime: 5 * 60 * 1000,
    });
}

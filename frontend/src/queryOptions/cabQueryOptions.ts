import { QUERY_KEYS } from "@/constants/queryKeys/queryKeys";
import { getCabDetails } from "@/services/api/cabApiService";
import type { ICabDetailsResponseDTO } from "@/types/api/responses/cabResponses";
import type { HttpResponse } from "@/types/api/responseType";
import { queryOptions } from "@tanstack/react-query";

export function createGetCabDetailsQueryOptions() {
    return queryOptions<HttpResponse<ICabDetailsResponseDTO>, Error>({
        queryKey: [QUERY_KEYS.CAB_DETAILS],
        queryFn: getCabDetails,
    });
}

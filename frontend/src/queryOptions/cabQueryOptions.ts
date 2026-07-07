import { QUERY_KEYS } from "@/constants/queryKeys/queryKeys";
import {
    deleteVehicleImage,
    getCabDetails,
    updateVehicleDetails,
    getCabDashboardStats,
} from "@/services/api/cabApiService";
import type {
    ICabDashboardFilter,
    ICabDashboardResponse,
} from "@/types/cab/dashboard.types";
import type { ICabDetailsResponseDTO } from "@/types/api/responses/cabResponses";
import type { HttpResponse } from "@/types/api/responseType";
import {
    mutationOptions,
    queryOptions,
    keepPreviousData,
} from "@tanstack/react-query";

export function createGetCabDetailsQueryOptions() {
    return queryOptions<HttpResponse<ICabDetailsResponseDTO>, Error>({
        queryKey: [QUERY_KEYS.CAB_DETAILS],
        queryFn: getCabDetails,
        retry: 1,
    });
}

export function createUpdateVehicleMutationOption() {
    return mutationOptions<HttpResponse<object>, Error, FormData>({
        mutationFn: updateVehicleDetails,
    });
}

export function createDeleteVehicleImageMutationOption() {
    return mutationOptions<HttpResponse<object>, Error, number>({
        mutationFn: deleteVehicleImage,
    });
}

export function createGetCabDashboardStatsQueryOptions(
    filter: ICabDashboardFilter
) {
    return queryOptions<HttpResponse<ICabDashboardResponse>, Error>({
        queryKey: [QUERY_KEYS.CAB_DASHBOARD_STATS, filter],
        queryFn: () => getCabDashboardStats(filter),
        placeholderData: keepPreviousData,
    });
}

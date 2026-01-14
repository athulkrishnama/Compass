import { QUERY_KEYS } from "@/constants/queryKeys/queryKeys";
import {
    deleteVehicleImage,
    getCabDetails,
    updateVehicleDetails,
} from "@/services/api/cabApiService";
import type { ICabDetailsResponseDTO } from "@/types/api/responses/cabResponses";
import type { HttpResponse } from "@/types/api/responseType";
import { mutationOptions, queryOptions } from "@tanstack/react-query";

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

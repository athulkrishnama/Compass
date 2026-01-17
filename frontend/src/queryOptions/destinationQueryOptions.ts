import { QUERY_KEYS } from "@/constants/queryKeys/queryKeys";
import {
    addDestination,
    DeleteDestinationImage,
    findDestinationById,
    findDestinations,
    updateDestination,
} from "@/services/api/destinationService";
import type { IFindDestinationsRequest } from "@/types/api/requests/adminRequest";
import type { IFindDestinationsResponse } from "@/types/api/responses/findDestinationAdminResponse";
import type { IFindDestinationResponseDTO } from "@/types/api/responses/findDestinationResponse";
import type { HttpResponse } from "@/types/api/responseType";
import {
    keepPreviousData,
    mutationOptions,
    queryOptions,
} from "@tanstack/react-query";

export function createAddDestinationMutationOption() {
    return mutationOptions<HttpResponse<object>, Error, FormData>({
        mutationFn: addDestination,
    });
}

export function createFindDestinationsQueryOption(
    filter: IFindDestinationsRequest
) {
    return queryOptions<HttpResponse<IFindDestinationsResponse>, Error>({
        queryKey: [QUERY_KEYS.DESTINATIONS, filter],
        queryFn: () => findDestinations(filter),
        placeholderData: keepPreviousData,
    });
}

export function createUpdateDestinationMutationOption() {
    return mutationOptions<
        HttpResponse<object>,
        Error,
        { id: string; data: FormData }
    >({
        mutationFn: updateDestination,
    });
}

export function createFindDestinationByIdQueryOption(id: string) {
    return queryOptions<HttpResponse<IFindDestinationResponseDTO>, Error>({
        queryKey: [QUERY_KEYS.DESTINATIONS, id],
        queryFn: () => findDestinationById(id),
    });
}

export function createDeleteDestinationImageMutationOption() {
    return mutationOptions<
        HttpResponse<object>,
        Error,
        { id: string; index: number }
    >({
        mutationFn: (data) => DeleteDestinationImage(data.id, data.index),
    });
}

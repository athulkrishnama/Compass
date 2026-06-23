import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { ICreateRideRequestDTO } from "@/types/api/requests/rideRequests";
import type { HttpResponse } from "@/types/api/responseType";
import {
    createRide,
    getRideDetails,
    getActiveRideDetails,
} from "@/services/api/rideApiService";
import { QUERY_KEYS } from "@/constants/queryKeys/queryKeys";
import type {
    ICreateRideResponseDTO,
    IRideDetailsResponseDTO,
    IActiveRideDetailsResponseDTO,
} from "@/types/api/responses/rideResponses";

export const createRideMutationOptions = () => {
    return mutationOptions<
        HttpResponse<ICreateRideResponseDTO>,
        Error,
        ICreateRideRequestDTO
    >({
        mutationFn: createRide,
    });
};

export function getRideDetailsQueryOptions(rideId: string) {
    return queryOptions<HttpResponse<IRideDetailsResponseDTO>, Error>({
        queryKey: [QUERY_KEYS.RIDE_DETAILS, rideId],
        queryFn: () => getRideDetails(rideId),
    });
}

export function getActiveRideDetailsQueryOptions() {
    return queryOptions<HttpResponse<IActiveRideDetailsResponseDTO>, Error>({
        queryKey: [QUERY_KEYS.ACTIVE_RIDE],
        queryFn: getActiveRideDetails,
        retry: false,
    });
}

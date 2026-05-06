import { mutationOptions } from "@tanstack/react-query";
import type { ICreateRideRequestDTO } from "@/types/api/requests/rideRequests";
import type { ICreateRideResponseDTO } from "@/types/api/responses/rideResponses";
import type { HttpResponse } from "@/types/api/responseType";
import { createRide } from "@/services/api/rideApiService";

export const createRideMutationOptions = () => {
    return mutationOptions<
        HttpResponse<ICreateRideResponseDTO>,
        Error,
        ICreateRideRequestDTO
    >({
        mutationFn: createRide,
    });
};

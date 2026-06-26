import { axiosInstance } from "@/axios/instance";
import { RIDE_ROUTES } from "@/constants/routes/rideRoutes";
import type { ICreateRideRequestDTO } from "@/types/api/requests/rideRequests";
import type {
    IRideDetailsResponseDTO,
    IActiveRideDetailsResponseDTO,
    IRideCabDetailsResponseDTO,
    IRiderPastTripResponseDTO,
    IDriverPastTripResponseDTO,
} from "@/types/api/responses/rideResponses";
import type { HttpResponse } from "@/types/api/responseType";
import { AxiosError } from "axios";

export async function createRide(data: ICreateRideRequestDTO) {
    try {
        const response = await axiosInstance.post(RIDE_ROUTES.SEARCH, data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Something went wrong");
    }
}

export async function getRideDetails(
    rideId: string
): Promise<HttpResponse<IRideDetailsResponseDTO>> {
    try {
        const response = await axiosInstance.get(
            `${RIDE_ROUTES.GET_RIDE_DETAILS}/${rideId}`
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Something went wrong");
    }
}

export async function getActiveRideDetails(): Promise<
    HttpResponse<IActiveRideDetailsResponseDTO>
> {
    try {
        const response = await axiosInstance.get(
            RIDE_ROUTES.DRIVER_ACTIVE_RIDE
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Something went wrong");
    }
}

export async function getRiderActiveRide(): Promise<
    HttpResponse<IRideDetailsResponseDTO>
> {
    try {
        const response = await axiosInstance.get(RIDE_ROUTES.RIDER_ACTIVE_RIDE);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Something went wrong");
    }
}

export async function getRideCabDetails(
    rideId: string
): Promise<HttpResponse<IRideCabDetailsResponseDTO>> {
    try {
        const response = await axiosInstance.get(
            `${RIDE_ROUTES.GET_RIDE_DETAILS}/${rideId}${RIDE_ROUTES.CAB_DETAILS}`
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Something went wrong");
    }
}

export async function getRiderPastTrips(
    page: number = 1,
    limit: number = 10
): Promise<
    HttpResponse<{ trips: IRiderPastTripResponseDTO[]; total: number }>
> {
    try {
        const response = await axiosInstance.get(RIDE_ROUTES.PAST_TRIPS, {
            params: { page, limit },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Something went wrong");
    }
}

export async function getDriverPastTrips(
    page: number = 1,
    limit: number = 10
): Promise<
    HttpResponse<{ trips: IDriverPastTripResponseDTO[]; total: number }>
> {
    try {
        const response = await axiosInstance.get(
            RIDE_ROUTES.DRIVER_PAST_TRIPS,
            { params: { page, limit } }
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Something went wrong");
    }
}

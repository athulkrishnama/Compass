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

export async function getDriverReport(params: {
    pageNo?: number;
    limit?: number;
    status?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
}) {
    try {
        const response = await axiosInstance.get(RIDE_ROUTES.DRIVER_REPORT, {
            params,
        });
        return response.data.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Something went wrong");
    }
}

export async function downloadDriverReportPdf(params: {
    status?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
}) {
    try {
        const response = await axiosInstance.get(
            RIDE_ROUTES.DRIVER_REPORT_PDF,
            {
                params,
                responseType: "blob",
            }
        );

        // Create blob link to download
        const url2 = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url2;
        link.setAttribute(
            "download",
            `driver_report_${new Date().toISOString()}.pdf`
        );
        document.body.appendChild(link);
        link.click();

        // Clean up
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url2);

        return true;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || "Failed to download PDF"
            );
        }
        throw new Error("Something went wrong");
    }
}

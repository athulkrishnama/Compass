import { axiosInstance } from "@/axios/instance";
import { RIDE_ROUTES } from "@/constants/routes/rideRoutes";
import type { ICreateRideRequestDTO } from "@/types/api/requests/rideRequests";
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

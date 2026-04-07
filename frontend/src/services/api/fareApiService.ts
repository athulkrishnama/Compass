import { axiosInstance } from "@/axios/instance";
import { RIDE_ROUTES } from "@/constants/routes/rideRoutes";
import type {
    ICalculateFareRequestDTO
} from "@/types/api/requests/fareRequests";
import type { ICalculateFareResponseDTO } from "@/types/api/responses/fareResponses";
import type { HttpResponse } from "@/types/api/responseType";
import { AxiosError } from "axios";


export async function calculateFare(
    data: ICalculateFareRequestDTO
): Promise<HttpResponse<ICalculateFareResponseDTO>> {
    try {
        const response = await axiosInstance.post(RIDE_ROUTES.FARE, data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

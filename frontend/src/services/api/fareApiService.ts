import { axiosInstance } from "@/axios/instance";
import type { ICalculateFareRequestDTO, ICalculateFareResponseDTO } from "@/types/api/requests/fareRequests";
import type { HttpResponse } from "@/types/api/responseType";
import { AxiosError } from "axios";

export const FARE_ROUTES = {
    CALCULATE: "/fare/calculate",
};

export async function calculateFare(data: ICalculateFareRequestDTO): Promise<HttpResponse<ICalculateFareResponseDTO>> {
    try {
        const response = await axiosInstance.post(FARE_ROUTES.CALCULATE, data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

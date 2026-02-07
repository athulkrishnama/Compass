import { axiosInstance } from "@/axios/instance";
import { PAYMENT_ROUTES } from "@/constants/routes/paymentRoutes";
import type { ICreatePaymentIntentRequestDTO } from "@/types/api/requests/paymentRequests";
import { AxiosError } from "axios";

export async function createPaymentIntent(
    data: ICreatePaymentIntentRequestDTO
) {
    try {
        const response = await axiosInstance.post(
            PAYMENT_ROUTES.CREATE_PAYMENT_INTENT,
            data
        );

        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Something went wrong");
    }
}

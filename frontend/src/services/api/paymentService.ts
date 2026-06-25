import { axiosInstance } from "@/axios/instance";
import {
    PAYMENT_ROUTES,
    CAB_PAYMENT_ROUTES,
} from "@/constants/routes/paymentRoutes";
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

export async function initiateCabPayment(
    tripId: string,
    paymentMethod: string
) {
    try {
        const response = await axiosInstance.post(CAB_PAYMENT_ROUTES.INITIATE, {
            tripId,
            paymentMethod,
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Something went wrong");
    }
}

export async function processWalletCabPayment(tripId: string) {
    try {
        const response = await axiosInstance.post(CAB_PAYMENT_ROUTES.WALLET, {
            tripId,
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Something went wrong");
    }
}

export async function getCabPaymentStatus(tripId: string) {
    try {
        const response = await axiosInstance.get(
            `${CAB_PAYMENT_ROUTES.STATUS}/${tripId}`
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Something went wrong");
    }
}

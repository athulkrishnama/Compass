import { axiosInstance } from "@/axios/instance";
import { BookingRoutes } from "@/constants/routes/bookingRoutes";
import { AxiosError } from "axios";
import type { BookingStatusResponse } from "@/types/booking";

export async function getBookingByPaymentId(
    paymentId: string
): Promise<BookingStatusResponse> {
    try {
        const response = await axiosInstance.get(
            BookingRoutes.BY_PAYMENT_ID.replace(":paymentId", paymentId)
        );
        return response.data.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data.message;
        }
        throw new Error("Something went wrong");
    }
}

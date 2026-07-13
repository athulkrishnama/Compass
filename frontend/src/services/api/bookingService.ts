import { axiosInstance } from "@/axios/instance";
import { BookingRoutes } from "@/constants/routes/bookingRoutes";
import { AxiosError } from "axios";
import type {
    BookingStatusResponse,
    IAvailableRoomsResponseDTO,
} from "@/types/booking";

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

export async function getHotelBookings(
    hotelId: string,
    params: {
        pageNo: number;
        roomVariantId?: string;
        status?: string;
        search?: string;
    }
) {
    try {
        const response = await axiosInstance.get(
            `${BookingRoutes.HOTEL_BOOKINGS}/${hotelId}/bookings`,
            { params }
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Something went wrong");
    }
}

export async function getAvailableRooms(
    hotelId: string,
    bookingId: string
): Promise<IAvailableRoomsResponseDTO> {
    try {
        const url = BookingRoutes.AVAILABLE_ROOMS.replace(
            ":hotelId",
            hotelId
        ).replace(":bookingId", bookingId);
        const response = await axiosInstance.get(url);
        return response.data.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Something went wrong");
    }
}

export async function checkInBooking(
    bookingId: string,
    hotelId: string,
    roomNumbers?: number[]
) {
    try {
        const url = BookingRoutes.CHECK_IN.replace(":hotelId", hotelId).replace(
            ":bookingId",
            bookingId
        );
        const response = await axiosInstance.patch(url, { roomNumbers });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Something went wrong");
    }
}

export async function checkOutBooking(bookingId: string, hotelId: string) {
    try {
        const url = BookingRoutes.CHECK_OUT.replace(
            ":hotelId",
            hotelId
        ).replace(":bookingId", bookingId);
        const response = await axiosInstance.patch(url);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Something went wrong");
    }
}

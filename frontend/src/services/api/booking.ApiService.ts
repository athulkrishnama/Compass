import { axiosInstance } from "@/axios/instance";
import { BookingRoutes } from "@/constants/routes/bookingRoutes";
import { AxiosError } from "axios";

export async function getTravelerUpcomingBookings(pageNo: number) {
    try {
        const response = await axiosInstance.get(BookingRoutes.UPCOMING, {
            params: { pageNo },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

export async function getTravelerOngoingBookings(pageNo: number) {
    try {
        const response = await axiosInstance.get(BookingRoutes.ONGOING, {
            params: { pageNo },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

export async function getTravelerCompletedBookings(pageNo: number) {
    try {
        const response = await axiosInstance.get(BookingRoutes.COMPLETED, {
            params: { pageNo },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

export async function getBookingDetails(bookingId: string) {
    try {
        const response = await axiosInstance.get(
            `${BookingRoutes.DETAILS}/${bookingId}`
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

export async function cancelBooking(bookingId: string) {
    try {
        const response = await axiosInstance.patch(
            `${BookingRoutes.CANCEL}/${bookingId}`
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

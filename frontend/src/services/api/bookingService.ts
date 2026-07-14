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

export async function getHotelReport(
    hotelId: string,
    params: {
        pageNo?: number;
        status?: string;
        search?: string;
        dateFrom?: string;
        dateTo?: string;
    }
) {
    try {
        const url = BookingRoutes.HOTEL_REPORT.replace(":hotelId", hotelId);
        const response = await axiosInstance.get(url, { params });
        return response.data.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Something went wrong");
    }
}

export async function downloadHotelReportPdf(
    hotelId: string,
    params: {
        status?: string;
        search?: string;
        dateFrom?: string;
        dateTo?: string;
    }
) {
    try {
        const url = BookingRoutes.HOTEL_REPORT_PDF.replace(":hotelId", hotelId);
        const response = await axiosInstance.get(url, {
            params,
            responseType: "blob",
        });

        const url2 = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url2;
        link.setAttribute(
            "download",
            `hotel_report_${hotelId}_${new Date().toISOString()}.pdf`
        );
        document.body.appendChild(link);
        link.click();

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

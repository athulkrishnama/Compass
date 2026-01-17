import { axiosInstance } from "@/axios/instance";
import { ROOM_ROUTES } from "@/constants/routes/roomRoutes";
import { AxiosError } from "axios";

export async function createRoom({
    hotelId,
    data,
}: {
    hotelId: string;
    data: FormData;
}) {
    try {
        const response = await axiosInstance.post(
            ROOM_ROUTES.BY_HOTEL.replace(":hotelId", hotelId),
            data
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

export async function getRoomByHotelId(hotelId: string) {
    try {
        const response = await axiosInstance.get(
            ROOM_ROUTES.BY_HOTEL.replace(":hotelId", hotelId)
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

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

export async function getRoomById(roomId: string) {
    try {
        const response = await axiosInstance.get(
            ROOM_ROUTES.BY_ID.replace(":id", roomId)
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

export async function updateRoom({
    roomId,
    data,
}: {
    roomId: string;
    data: FormData;
}) {
    try {
        const response = await axiosInstance.patch(
            ROOM_ROUTES.BY_ID.replace(":id", roomId),
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

export async function deleteRoomImage({
    roomId,
    index,
}: {
    roomId: string;
    index: number;
}) {
    try {
        const response = await axiosInstance.delete(
            `${ROOM_ROUTES.BY_ID.replace(":id", roomId)}/images/${index}`
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

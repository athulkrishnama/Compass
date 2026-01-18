import { axiosInstance } from "@/axios/instance";
import { ROOM_ROUTES } from "@/constants/routes/roomRoutes";
import { AxiosError } from "axios";

export interface CreateRoomData {
    hotelId: string;
    variantId: string;
    roomCode: string;
    floor: number;
    status: string;
}

export async function createRoom(data: CreateRoomData) {
    try {
        const response = await axiosInstance.post(ROOM_ROUTES.INDEX, data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

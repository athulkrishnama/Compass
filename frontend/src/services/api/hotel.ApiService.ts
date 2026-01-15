import { axiosInstance } from "@/axios/instance";
import { HOTEL_ROUTES } from "@/constants/routes/hoetlRoutes";
import { AxiosError } from "axios";

export async function createHotel<T>(data: T) {
    try {
        const response = await axiosInstance.post(HOTEL_ROUTES.INDEX, data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

export async function getHotelsByUserId() {
    try {
        const response = await axiosInstance.get(HOTEL_ROUTES.INDEX);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

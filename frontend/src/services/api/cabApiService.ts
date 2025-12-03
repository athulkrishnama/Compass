import { axiosInstance } from "@/axios/instance";
import { CAB_ROUTES } from "@/constants/routes/cabRoutes";
import { AxiosError } from "axios";

export async function getCabDetails() {
    try {
        const response = await axiosInstance.get(CAB_ROUTES.CAB_DETAILS);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}
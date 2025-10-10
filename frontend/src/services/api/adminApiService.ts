import { axiosInstance } from "@/axios/instance";
import { AdminRoutes } from "@/constants/routes/adminRoutes";
import { AxiosError } from "axios";

export async function getUsers(page: number) {
    try {
        const response = await axiosInstance.get(AdminRoutes.USERS, {
            params: { pageNo: page },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.error);
        }
        throw new Error("something went wrong");
    }
}

export async function changeUserStatus<T>(data: T) {
    try {
        const response = await axiosInstance.post(AdminRoutes.STATUS, data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.error);
        }
        throw new Error("something went wrong");
    }
}

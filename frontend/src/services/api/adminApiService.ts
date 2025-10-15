import { axiosInstance } from "@/axios/instance";
import { AdminRoutes } from "@/constants/routes/adminRoutes";
import type { filterType } from "@/pages/admin/Users";
import { AxiosError } from "axios";

export async function getUsers(filter: filterType) {
    try {
        const response = await axiosInstance.get(AdminRoutes.USERS, {
            params: { ...filter },
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

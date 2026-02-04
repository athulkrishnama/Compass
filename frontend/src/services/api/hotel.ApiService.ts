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

export async function getHotelById(id: string) {
    try {
        const response = await axiosInstance.get(
            HOTEL_ROUTES.EDIT.replace(":id", id)
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

export async function updateHotel({
    id,
    data,
}: {
    id: string;
    data: FormData;
}) {
    try {
        const response = await axiosInstance.patch(
            HOTEL_ROUTES.EDIT.replace(":id", id),
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

export async function deleteHotelImage({
    id,
    index,
}: {
    id: string;
    index: number;
}) {
    try {
        const response = await axiosInstance.delete(
            HOTEL_ROUTES.EDIT.replace(":id", id) + `/images/${index}`
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

export async function searchHotels<T extends object>(data: T) {
    try {
        const paramsData: Record<string, string | number> = {};
        for (const key in data) {
            if (typeof data[key] === "object") {
                paramsData[key] = JSON.stringify(data[key]);
            } else {
                paramsData[key] = data[key] as string | number;
            }
        }
        const response = await axiosInstance.get(HOTEL_ROUTES.SEARCH, {
            params: paramsData,
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

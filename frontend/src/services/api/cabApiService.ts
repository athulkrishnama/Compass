import { axiosInstance } from "@/axios/instance";
import { CAB_ROUTES } from "@/constants/routes/cabRoutes";
import { AxiosError } from "axios";
import type { HttpResponse } from "@/types/api/responseType";
import type { INearbyDriver } from "@/types/api/responses/cabResponses";

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

export async function updateVehicleDetails<T>(data: T) {
    try {
        const response = await axiosInstance.patch(CAB_ROUTES.VEHICLE, data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

export async function deleteVehicleImage(index: number) {
    try {
        const response = await axiosInstance.delete(
            `${CAB_ROUTES.IMAGE}/${index}`
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

export async function getCabDashboardStats(filter: {
    type: "weekly" | "monthly" | "yearly";
    year?: number;
}) {
    try {
        const response = await axiosInstance.get(CAB_ROUTES.DASHBOARD, {
            params: filter,
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

export async function getNearbyDrivers(
    latitude: number,
    longitude: number
): Promise<HttpResponse<INearbyDriver[]>> {
    try {
        const response = await axiosInstance.get(CAB_ROUTES.NEARBY, {
            params: { latitude, longitude },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

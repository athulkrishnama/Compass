import { axiosInstance } from "@/axios/instance";
import { DESTINATION_ROUTES } from "@/constants/routes/destinationRoutes";
import type { IFindDestinationsRequest } from "@/types/api/requests/adminRequest";
import { AxiosError } from "axios";

export async function addDestination<T>(data: T) {
    try {
        const response = await axiosInstance.post(
            DESTINATION_ROUTES.DESTINATIONS,
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

export async function findDestinations(data: IFindDestinationsRequest) {
    try {
        const params = {
            pageNo: data.pageNo,
            query: data.query,
            type: JSON.stringify(data.type),
            isFree: JSON.stringify(data.isFree),
            isActive: JSON.stringify(data.isActive),
        };
        const response = await axiosInstance.get(
            DESTINATION_ROUTES.DESTINATIONS,
            {
                params,
            }
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

export async function updateDestination<T>({
    id,
    data,
}: {
    id: string;
    data: T;
}) {
    try {
        const response = await axiosInstance.patch(
            `${DESTINATION_ROUTES.DESTINATIONS}/${id}`,
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

export async function findDestinationById(id: string) {
    try {
        const response = await axiosInstance.get(
            `${DESTINATION_ROUTES.DESTINATIONS}/${id}`
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

export async function DeleteDestinationImage(id: string, index: number) {
    try {
        const response = await axiosInstance.delete(
            DESTINATION_ROUTES.DESTINATION_IMAGE.replace("##id##", id).replace(
                "##index##",
                String(index)
            )
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

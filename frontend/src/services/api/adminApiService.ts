import { axiosInstance } from "@/axios/instance";
import { AdminRoutes } from "@/constants/routes/adminRoutes";
import type { filterType } from "@/pages/admin/Users";
import type { IFindDestinationsRequest } from "@/types/api/requests/adminRequest";
import { AxiosError } from "axios";

export async function getUsers(filter: filterType) {
    try {
        const response = await axiosInstance.get(AdminRoutes.USERS, {
            params: { ...filter },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

export async function changeUserStatus<T>(data: T) {
    try {
        const response = await axiosInstance.patch(AdminRoutes.STATUS, data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

export async function getUnverifiedUsers<T>(data: T) {
    try {
        const response = await axiosInstance.get(AdminRoutes.UNVERIFIED_USERS, {
            params: { ...data },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

export async function getUnverifiedUserDetails(id: string) {
    try {
        const response = await axiosInstance.get(
            `${AdminRoutes.UNVERIFIED_USERS}/${id}`
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

export async function approveUserVerificationRequest(id: string) {
    try {
        const response = await axiosInstance.patch(
            AdminRoutes.APPROVE_USER.replace("##id##", id)
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

export async function rejectUserVerificationRequest<T>(id: string, data: T) {
    try {
        const response = await axiosInstance.patch(
            AdminRoutes.REJECT_USER.replace("##id##", id),
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

export async function addDestination<T>(data: T) {
    try {
        const response = await axiosInstance.post(
            AdminRoutes.DESTINATIONS,
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
        const response = await axiosInstance.get(AdminRoutes.DESTINATIONS, {
            params,
        });
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
            `${AdminRoutes.DESTINATIONS}/${id}`,
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
            `${AdminRoutes.DESTINATIONS}/${id}`
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
            AdminRoutes.DESTINATION_IMAGE.replace("##id##", id).replace(
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

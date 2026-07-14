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

export async function getAdminTransactions(page: number) {
    try {
        const response = await axiosInstance.get(AdminRoutes.TRANSACTIONS, {
            params: { page },
        });
        return response.data.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
    }
}

export async function getDashboardStats(filter: {
    type: "weekly" | "monthly" | "yearly";
    year?: number;
}) {
    try {
        const response = await axiosInstance.get(
            `${AdminRoutes.DASHBOARD_STATS}`,
            {
                params: filter,
            }
        );
        return response.data.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

export async function getAdminHotelReport(params: {
    pageNo?: number;
    limit?: number;
    status?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
}) {
    try {
        const response = await axiosInstance.get(AdminRoutes.HOTEL_REPORT, {
            params,
        });
        return response.data.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Something went wrong");
    }
}

export async function downloadAdminHotelReportPdf(params: {
    status?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
}) {
    try {
        const response = await axiosInstance.get(AdminRoutes.HOTEL_REPORT_PDF, {
            params,
            responseType: "blob",
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
            "download",
            `admin_hotel_report_${new Date().toISOString()}.pdf`
        );
        document.body.appendChild(link);
        link.click();

        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);

        return true;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || "Failed to download PDF"
            );
        }
        throw new Error("Something went wrong");
    }
}

export async function getAdminCabReport(params: {
    pageNo?: number;
    limit?: number;
    status?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
}) {
    try {
        const response = await axiosInstance.get(AdminRoutes.CAB_REPORT, {
            params,
        });
        return response.data.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Something went wrong");
    }
}

export async function downloadAdminCabReportPdf(params: {
    status?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
}) {
    try {
        const response = await axiosInstance.get(AdminRoutes.CAB_REPORT_PDF, {
            params,
            responseType: "blob",
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
            "download",
            `admin_cab_report_${new Date().toISOString()}.pdf`
        );
        document.body.appendChild(link);
        link.click();

        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);

        return true;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data?.message || "Failed to download PDF"
            );
        }
        throw new Error("Something went wrong");
    }
}

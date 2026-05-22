import { axiosInstance } from "@/axios/instance";
import { NOTIFICATION_API_ROUTES } from "../../constants/routes/notificationRoutes";

export const notificationApiService = {
    getNotifications: async (page: number = 1, limit: number = 20) => {
        const response = await axiosInstance.get(
            `${NOTIFICATION_API_ROUTES.BASE}?page=${page}&limit=${limit}`
        );
        return response.data;
    },

    getUnreadCount: async () => {
        const response = await axiosInstance.get(
            NOTIFICATION_API_ROUTES.UNREAD_COUNT
        );
        return response.data;
    },

    markAsRead: async (notificationId: string) => {
        const response = await axiosInstance.patch(
            NOTIFICATION_API_ROUTES.MARK_READ(notificationId)
        );
        return response.data;
    },

    markAllAsRead: async () => {
        const response = await axiosInstance.patch(
            NOTIFICATION_API_ROUTES.MARK_ALL_READ
        );
        return response.data;
    },
};

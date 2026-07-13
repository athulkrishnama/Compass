import { axiosInstance } from "@/axios/instance";
import { NOTIFICATION_API_ROUTES } from "../../constants/routes/notificationRoutes";
import { type Notification } from "../../store/slices/notificationSlice";

export const notificationApiService = {
    getNotifications: async (
        page: number = 1,
        limit: number = 20
    ): Promise<Notification[]> => {
        const response = await axiosInstance.get(
            `${NOTIFICATION_API_ROUTES.BASE}?page=${page}&limit=${limit}`
        );
        return response.data.data ?? [];
    },

    getUnreadCount: async (): Promise<{ count: number }> => {
        const response = await axiosInstance.get(
            NOTIFICATION_API_ROUTES.UNREAD_COUNT
        );
        return response.data.data ?? { count: 0 };
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

import { queryOptions } from "@tanstack/react-query";
import { notificationApiService } from "../services/api/notificationApiService";
import { QUERY_KEYS } from "../constants/queryKeys/queryKeys";

export const notificationQueryOptions = {
    notifications: (page: number = 1, limit: number = 20) =>
        queryOptions({
            queryKey: [QUERY_KEYS.NOTIFICATIONS, { page, limit }],
            queryFn: () => notificationApiService.getNotifications(page, limit),
        }),

    unreadCount: () =>
        queryOptions({
            queryKey: [
                QUERY_KEYS.NOTIFICATIONS,
                QUERY_KEYS.UNREAD_NOTIFICATIONS_COUNT,
            ],
            queryFn: () => notificationApiService.getUnreadCount(),
        }),
};

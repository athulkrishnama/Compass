import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationQueryOptions } from "../../../queryOptions/notificationQueryOptions";
import { notificationApiService } from "../../../services/api/notificationApiService";
import { NotificationItem } from "./NotificationItem";
import { useDispatch, useSelector } from "react-redux";
import {
    setNotifications,
    markAsRead,
    markAllAsRead,
} from "../../../store/slices/notificationSlice";
import { type RootState } from "../../../store/store";
import { Loader2, CheckCheck } from "lucide-react";

export const NotificationPanel: React.FC = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const [limit, setLimit] = React.useState(20);
    const [isExpanded, setIsExpanded] = React.useState(false);
    const { notifications } = useSelector(
        (state: RootState) => state.notification
    );

    const { isLoading, data } = useQuery({
        ...notificationQueryOptions.notifications(1, limit),
        staleTime: 0,
    });

    React.useEffect(() => {
        if (Array.isArray(data)) {
            dispatch(setNotifications(data));
        }
    }, [data, dispatch]);

    const markReadMutation = useMutation({
        mutationFn: (id: string) => notificationApiService.markAsRead(id),
        onSuccess: (_, id) => {
            dispatch(markAsRead(id));
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    const markAllReadMutation = useMutation({
        mutationFn: () => notificationApiService.markAllAsRead(),
        onSuccess: () => {
            dispatch(markAllAsRead());
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    const showSpinner = isLoading && notifications.length === 0;

    const handleViewAll = () => {
        setIsExpanded(true);
        setLimit(50);
    };

    return (
        <div
            className={`w-80 flex flex-col bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-[75vh]" : "max-h-[450px]"}`}
        >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-black">Notifications</h3>
                <button
                    onClick={() => markAllReadMutation.mutate()}
                    className="text-xs text-gray-700 hover:text-black flex items-center gap-1 font-medium transition-colors"
                >
                    <CheckCheck size={14} />
                    Mark all as read
                </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-[100px]">
                {showSpinner ? (
                    <div className="flex justify-center items-center h-32">
                        <Loader2 className="animate-spin text-gray-400" />
                    </div>
                ) : notifications.length > 0 ? (
                    notifications.map((n) => (
                        <NotificationItem
                            key={n._id}
                            notification={n}
                            onMarkAsRead={(id) => markReadMutation.mutate(id)}
                        />
                    ))
                ) : (
                    <div className="p-10 text-center text-gray-500 italic text-sm">
                        No notifications yet
                    </div>
                )}
            </div>

            {!isExpanded && notifications.length >= 20 && (
                <div className="p-3 border-t border-gray-100 text-center bg-gray-50/30">
                    <button
                        onClick={handleViewAll}
                        className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                    >
                        View all notifications
                    </button>
                </div>
            )}
        </div>
    );
};

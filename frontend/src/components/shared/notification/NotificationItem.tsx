import React from "react";
import { type Notification } from "../../../store/slices/notificationSlice";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
    notification,
    onMarkAsRead,
}) => {
    return (
        <div
            onClick={() =>
                !notification.is_read && onMarkAsRead(notification._id)
            }
            className={cn(
                "p-4 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors",
                !notification.is_read && "bg-gray-100/50"
            )}
        >
            <div className="flex justify-between items-start mb-1">
                <h4
                    className={cn(
                        "text-sm font-semibold",
                        notification.is_read ? "text-gray-600" : "text-black"
                    )}
                >
                    {notification.title}
                </h4>
                {!notification.is_read && (
                    <span className="w-2 h-2 bg-black rounded-full" />
                )}
            </div>
            <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                {notification.message}
            </p>
            <span className="text-[10px] text-gray-400">
                {formatDistanceToNow(new Date(notification.created_at), {
                    addSuffix: true,
                })}
            </span>
        </div>
    );
};

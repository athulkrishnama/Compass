import React from "react";
import * as Popover from "@radix-ui/react-popover";
import { Bell } from "lucide-react";
import { NotificationPanel } from "./NotificationPanel";
import { useQuery } from "@tanstack/react-query";
import { notificationQueryOptions } from "../../../queryOptions/notificationQueryOptions";
import { useDispatch, useSelector } from "react-redux";
import { setUnreadCount } from "../../../store/slices/notificationSlice";
import { type RootState } from "../../../store/store";
import { cn } from "@/lib/utils";

export const NotificationBell: React.FC = () => {
    const dispatch = useDispatch();
    const { unreadCount } = useSelector(
        (state: RootState) => state.notification
    );

    const { data } = useQuery({
        ...notificationQueryOptions.unreadCount(),
        refetchInterval: 60000,
    });

    React.useEffect(() => {
        if (data) {
            dispatch(setUnreadCount(data.count));
        }
    }, [data, dispatch]);

    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <button
                    className="relative p-2 rounded-full hover:bg-gray-100 transition-all active:scale-95 group focus:outline-none"
                    aria-label="Notifications"
                >
                    <Bell
                        className={cn(
                            "w-6 h-6 transition-colors",
                            unreadCount > 0
                                ? "text-black fill-gray-100"
                                : "text-gray-600 group-hover:text-black"
                        )}
                    />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-black text-[10px] text-white font-bold items-center justify-center">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        </span>
                    )}
                </button>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    sideOffset={8}
                    align="end"
                    className="z-[100] animate-in fade-in zoom-in duration-200"
                >
                    <NotificationPanel />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
};

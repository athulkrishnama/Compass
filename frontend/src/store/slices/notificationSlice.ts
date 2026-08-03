import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Notification {
    _id: string;
    type: string;
    title: string;
    message: string;
    data: Record<string, unknown>;
    is_read: boolean;
    created_at: string;
}

interface NotificationState {
    unreadCount: number;
    notifications: Notification[];
    isOpen: boolean;
}

const initialState: NotificationState = {
    unreadCount: 0,
    notifications: [],
    isOpen: false,
};

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setNotifications(state, action: PayloadAction<Notification[]>) {
            state.notifications = action.payload;
        },
        addNotification(state, action: PayloadAction<Notification>) {
            state.notifications.unshift(action.payload);
            state.unreadCount += 1;
        },
        setUnreadCount(state, action: PayloadAction<number>) {
            state.unreadCount = action.payload;
        },
        markAsRead(state, action: PayloadAction<string>) {
            const notification = state.notifications.find(
                (n) => n._id === action.payload
            );
            if (notification && !notification.is_read) {
                notification.is_read = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        },
        markAllAsRead(state) {
            state.notifications.forEach((n) => (n.is_read = true));
            state.unreadCount = 0;
        },
        togglePanel(state) {
            state.isOpen = !state.isOpen;
        },
        closePanel(state) {
            state.isOpen = false;
        },
        setPanelOpen(state, action: PayloadAction<boolean>) {
            state.isOpen = action.payload;
        },
    },
});

export const {
    setNotifications,
    addNotification,
    setUnreadCount,
    markAsRead,
    markAllAsRead,
    togglePanel,
    closePanel,
    setPanelOpen,
} = notificationSlice.actions;

export default notificationSlice.reducer;

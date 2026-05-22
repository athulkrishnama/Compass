export const SocketEvents = {
    // Ride events (Client <- Server)
    RIDER_EVENTS: "rider:events",
    DRIVER_EVENTS: "driver:events",

    // Location events
    LOCATION_UPDATE: "location:update",
    DRIVER_LOCATION_BROADCAST: "driver:location-broadcast",

    // Payment events
    PAYMENT_COMPLETED: "payment:completed",
    PAYMENT_FAILED: "payment:failed",

    // Notification events
    NOTIFICATION_NEW: "notification:new",
    NOTIFICATION_READ: "notification:read",
} as const;

export const SocketEvents = {
    // Ride events (Client <- Server)
    RIDER_EVENTS: "rider:events",
    DRIVER_EVENTS: "driver:events",

    // Ride events (Client -> Server)
    DRIVER_ACCEPT_RIDE: "driver:accept-ride",
    DRIVER_REJECT_RIDE: "driver:reject-ride",
    RIDER_CANCEL_RIDE: "rider:cancel-ride",

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

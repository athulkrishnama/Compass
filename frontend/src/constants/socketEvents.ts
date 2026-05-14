export const SocketEvents = {
    // Ride events (Client <- Server)
    RIDE_NEW_REQUEST: "ride:new-request",
    RIDE_DRIVER_ASSIGNED: "ride:driver-assigned",
    RIDE_NO_DRIVERS: "ride:no-drivers-found",
    RIDE_CANCELLED: "ride:cancelled",
    RIDE_STARTED: "ride:started",
    RIDE_COMPLETED: "ride:completed",

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

export const SocketEvents = {
    // Ride events (Client <- Server)
    RIDER_EVENTS: "rider:events",
    DRIVER_EVENTS: "driver:events",

    // Ride events (Client -> Server)
    DRIVER_ACCEPT_RIDE: "driver:accept-ride",
    DRIVER_REJECT_RIDE: "driver:reject-ride",
    DRIVER_ARRIVED: "driver:arrived",
    DRIVER_VERIFY_OTP: "driver:verify-otp",
    DRIVER_RIDE_COMPLETED: "driver:ride-completed",
    DRIVER_CANCEL_RIDE: "driver:cancel-ride",
    RIDER_CANCEL_RIDE: "rider:cancel-ride",

    // Location events
    LOCATION_UPDATE: "location:update",
    DRIVER_LOCATION_UPDATE: "driver:location-update",
    DRIVER_LOCATION_BROADCAST: "driver:location-broadcast",
    JOIN_RIDE_ROOM: "ride:join-room",
    LEAVE_RIDE_ROOM: "ride:leave-room",

    // Notification events
    NOTIFICATION_NEW: "notification:new",
    NOTIFICATION_READ: "notification:read",
} as const;

export const SocketEvents = {
  USER_CONNECT: "user:connect",
  USER_DISCONNECT: "user:disconnect",

  DRIVER_LOCATION_UPDATE: "driver:location-update",
  DRIVER_ACCEPT_RIDE: "driver:accept-ride",
  DRIVER_REJECT_RIDE: "driver:reject-ride",
  DRIVER_GO_ONLINE: "driver:go-online",
  DRIVER_GO_OFFLINE: "driver:go-offline",
  RIDER_CANCEL_RIDE: "rider:cancel-ride",
  DRIVER_RIDE_STARTED: "driver:ride-started",
  DRIVER_RIDE_COMPLETED: "driver:ride-completed",

  RIDE_NEW_REQUEST: "ride:new-request",
  RIDE_DRIVER_ASSIGNED: "ride:driver-assigned",
  RIDE_CANCELLED: "ride:cancelled",
  RIDE_ACCEPTANCE_REJECTED: "ride:acceptance-rejected",
  RIDE_NO_DRIVERS: "ride:no-drivers-found",
  DRIVER_LOCATION_BROADCAST: "driver:location-broadcast",
  PAYMENT_COMPLETED: "payment:completed",
  PAYMENT_FAILED: "payment:failed",

  NOTIFICATION_NEW: "notification:new",
  NOTIFICATION_READ: "notification:read",
} as const;

export const SocketConstants = {
  USER_SOCKET_PREFIX: "socket:user:",
} as const;

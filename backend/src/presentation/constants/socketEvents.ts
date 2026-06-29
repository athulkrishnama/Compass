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
  DRIVER_ARRIVED: "driver:arrived",
  DRIVER_VERIFY_OTP: "driver:verify-otp",
  DRIVER_CANCEL_RIDE: "driver:cancel-ride",

  RIDER_EVENTS: "rider:events",
  DRIVER_EVENTS: "driver:events",
  RIDE_ACCEPTANCE_REJECTED: "ride:acceptance-rejected",
  DRIVER_LOCATION_BROADCAST: "driver:location-broadcast",
  PAYMENT_SUCCESS: "payment:success",
  PAYMENT_RECEIVED: "payment:received",
  PAYMENT_INITIATED: "payment:initiated",

  NOTIFICATION_NEW: "notification:new",
  NOTIFICATION_READ: "notification:read",
  JOIN_RIDE_ROOM: "ride:join-room",
  LEAVE_RIDE_ROOM: "ride:leave-room",
} as const;

export const SocketConstants = {
  USER_SOCKET_PREFIX: "socket:user:",
} as const;

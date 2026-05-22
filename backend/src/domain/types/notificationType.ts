export const NOTIFICATION_TYPES = {
  RIDE_REQUEST: "ride_request",
  RIDE_ASSIGNED: "ride_assigned",
  RIDE_CANCELLED: "ride_cancelled",
  NO_DRIVERS: "no_drivers",
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

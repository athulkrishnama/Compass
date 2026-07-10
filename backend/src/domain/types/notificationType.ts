export const NOTIFICATION_TYPES = {
  // Ride types
  RIDE_REQUEST: "ride_request",
  RIDE_ASSIGNED: "ride_assigned",
  RIDE_CANCELLED: "ride_cancelled",
  NO_DRIVERS: "no_drivers",
  RIDE_ACCEPTED: "ride_accepted",
  RIDE_ARRIVED: "ride_arrived",
  RIDE_STARTED: "ride_started",
  RIDE_COMPLETED: "ride_completed",

  // Hotel booking types
  BOOKING_CONFIRMED: "booking_confirmed",
  BOOKING_CANCELLED: "booking_cancelled",
  BOOKING_CHECKED_IN: "booking_checked_in",
  BOOKING_CHECKED_OUT: "booking_checked_out",
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

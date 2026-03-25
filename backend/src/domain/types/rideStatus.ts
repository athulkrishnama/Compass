export const RIDE_STATUS = [
  "SEARCHING",
  "WAITING_RESPONSE",
  "ACCEPTED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "FAILED",
] as const;
export type RideStatus = (typeof RIDE_STATUS)[number];

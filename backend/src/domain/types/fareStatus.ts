export const FARE_STATUS = [
  "PENDING_SELECTION",
  "CONFIRMED",
  "EXPIRED",
] as const;
export type FareStatus = (typeof FARE_STATUS)[number];

export const RIDE_STATUSES = {
    SEARCHING: "searching",
    MATCHED: "matched",
    IN_TRANSIT: "in_transit",
    ARRIVED: "arrived",
    CANCELLED: "cancelled",
    COMPLETED: "completed",
} as const;

export type RideStatus = (typeof RIDE_STATUSES)[keyof typeof RIDE_STATUSES];

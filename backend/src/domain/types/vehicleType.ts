export const VEHICLE_TYPES = ["RICKSHAW", "SUV", "SEDAN"] as const;
export type VehicleType = (typeof VEHICLE_TYPES)[number];

export const VEHICLE_TYPES = ["RICKSHAW", "SEDAN", "SUV"] as const;
export type VehicleType = (typeof VEHICLE_TYPES)[number];

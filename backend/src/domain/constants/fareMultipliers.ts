import { VehicleType } from "@domain/types/vehicleType";

export const FARE_MULTIPLIERS: Record<
  VehicleType,
  { perKm: number; perMinute: number; baseFare: number }
> = {
  RICKSHAW: { perKm: 12, perMinute: 2, baseFare: 30 },
  SEDAN: { perKm: 18, perMinute: 3, baseFare: 60 },
  SUV: { perKm: 25, perMinute: 4, baseFare: 100 },
};

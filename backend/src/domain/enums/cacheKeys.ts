import { VehicleType } from "@domain/types/vehicleType";

export const RedisKeys = {
  DRIVER_LOCATION: (vehicle_type: VehicleType) =>
    `driver:location:${vehicle_type}`,
  DRIVER_AVAILABLE: (driverId: string) => `driver:available:${driverId}`,
  DRIVER_HEADING: (driverId: string) => `driver:heading:${driverId}`,
} as const;

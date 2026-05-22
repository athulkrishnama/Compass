import { Coordinate } from "@domain/types/coordinate";
import { VehicleType } from "@domain/types/vehicleType";

export interface IGeoService {
  addDriverLocation(
    driverId: string,
    coordinates: Coordinate,
    vehicleType: VehicleType,
  ): Promise<void>;
  getNearbyDrivers(
    coordinates: Coordinate,
    radius: number,
    vehicleType: VehicleType,
    count?: number,
    attemptedDrivers?: string[],
  ): Promise<string | null>;
  cleanupStaleDrivers(): Promise<void>;
}

import { Coordinate } from "@domain/types/coordinate";
import { VehicleType } from "@domain/types/vehicleType";

import { INearbyDriverResponseDTO } from "@domain/dtos/cab/nearbyDrivers.dto";

export interface IGeoService {
  addDriverLocation(
    driverId: string,
    coordinates: Coordinate,
    vehicleType: VehicleType,
    heading?: number,
  ): Promise<void>;
  getNearbyDrivers(
    coordinates: Coordinate,
    radius: number,
    vehicleType: VehicleType,
    count?: number,
    attemptedDrivers?: string[],
  ): Promise<string | null>;
  cleanupStaleDrivers(): Promise<void>;
  getAllNearbyDrivers(
    coordinates: Coordinate,
    radius: number,
    vehicleType?: VehicleType,
  ): Promise<INearbyDriverResponseDTO[]>;
}

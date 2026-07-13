import { Coordinate } from "@domain/types/coordinate";
import { VehicleType } from "@domain/types/vehicleType";

export interface INearbyDriversRequestDTO {
  coordinates: Coordinate;
}

export interface INearbyDriverResponseDTO {
  driverId: string;
  vehicleType: VehicleType;
  coordinates: Coordinate;
  heading?: number;
}

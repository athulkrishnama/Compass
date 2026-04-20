import { Coordinate } from "@domain/types/coordinate";
import { VehicleType } from "@domain/types/vehicleType";

export interface ILocationUpdateRequestDTO {
  user_id: string;
  coordinates: Coordinate;
  vehicle_type: VehicleType;
}

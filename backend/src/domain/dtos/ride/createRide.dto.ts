import { VehicleType } from "@domain/types/vehicleType";

export interface createRideRequestDTO {
  userId: string;
  fareId: string;
  vehicleType: VehicleType;
}

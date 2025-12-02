import { VehicleType } from "@domain/types/vehicleType";

export interface IUpdateVehicleRequestDTO {
  userId: string;
  model?: string;
  type?: VehicleType;
  registrationNumber?: string;
  images?: File[];
}

import { VehicleType } from "@domain/types/vehicleType";

export interface IUpdateVehicleRequestDTO {
  userId: string;
  model?: string;
  type?: VehicleType;
  registrationNumber?: string;
  images?: File[];
  isOnline?: boolean;
  baseLocation?: {
    city: string;
    coordinates: [number, number];
  };
}

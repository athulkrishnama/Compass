import { VehicleType } from "@domain/types/vehicleType";

export interface IGetCabDetailsResponseDTO {
  baseLocation?: {
    city: string;
    coordinates: [number, number];
  };
  isOnline: boolean;
  vehicleDetails?: Vehicle;
}

interface Vehicle {
  model: string;
  type: VehicleType;
  registrationNumber: string;
  images: string[];
}

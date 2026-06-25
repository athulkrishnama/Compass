import { VehicleType } from "@domain/types/vehicleType";

export interface RideCabDetailsResponseDTO {
  driver: {
    _id: string;
    full_name: string;
    mobile?: string;
    profile_image?: string;
  };
  cab: {
    model: string;
    type: VehicleType;
    registrationNumber: string;
    images: string[];
  };
}

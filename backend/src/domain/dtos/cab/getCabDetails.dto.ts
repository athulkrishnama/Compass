import { VehicleType } from "@domain/types/vehicleType";

export interface IGetCabDetailsResponseDTO {
    baseLocation?: string;
    isOnline: boolean;
    vehicleDetails?: Vehicle;
}

interface Vehicle {
    model: string;
    type: VehicleType;
    registrationNumber: string;
    images: string[];
}

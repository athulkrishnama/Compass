import type { VehicleType } from "@/types/vehicleType";

export interface ICabDetailsResponseDTO {
    baseLocation?: {
        city?: string;
        coordinates?: [number, number];
    };
    isOnline: boolean;
    vehicleDetails: Vehicle;
}

interface Vehicle {
    model: string;
    type: VehicleType;
    registrationNumber: string;
    images: string[];
}

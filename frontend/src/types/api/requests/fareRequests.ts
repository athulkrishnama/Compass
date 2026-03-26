export interface Coordinate {
    latitude: number;
    longitude: number;
}

export type VehicleType = "RICKSHAW" | "SUV" | "SEDAN";

export interface FareOption {
    cab_type: VehicleType;
    total_fare: number;
}

export interface ICalculateFareRequestDTO {
    travelerId?: string; // Typically extracted from token in backend, but included for completeness if needed in request
    pickup: Coordinate;
    dropoff: Coordinate;
}

export interface ICalculateFareResponseDTO {
    id: string;
    distance: number;
    time: number;
    fares: FareOption[];
}

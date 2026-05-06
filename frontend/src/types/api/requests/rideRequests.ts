import type { VehicleType } from "../vehicleType";

export interface ICreateRideRequestDTO {
    fareId: string;
    vehicleType: VehicleType;
}

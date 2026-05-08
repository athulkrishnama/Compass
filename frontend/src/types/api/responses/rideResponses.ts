import type { Coordinate } from "@/types/coordinate";
import type { FareOption } from "../fareOption";
import type { RideStatus } from "@/types/rideStatus";
import type { ROLES } from "@/constants/roles";

export interface ICreateRideResponseDTO {
    rideId: string;
}

export interface IRideDetailsResponseDTO {
    _id: string;
    status: RideStatus;
    pickup_point: Coordinate;
    dropoff_point: Coordinate;
    distance: number;
    time: number;
    selected_fare: FareOption;
    otp: string | null;
    cancelled_by: ROLES | null;
    events: { event_name: string; actor: ROLES; timestamp: string }[];
}

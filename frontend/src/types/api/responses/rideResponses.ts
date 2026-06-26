import type { Coordinate } from "@/types/coordinate";
import type { FareOption } from "../fareOption";
import type { RideStatus } from "@/types/rideStatus";
import type { ROLES } from "@/constants/roles";
import type { RideEvent } from "@/types/rideEvent";
import { PaymentStatus } from "@/enums/paymentStatus";

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
    cancelled_by: ROLES | "timeout" | null;
    events: RideEvent[];
    paymentStatus?: PaymentStatus;
}

export interface IActiveRideDetailsResponseDTO {
    _id: string;
    pickup_point: Coordinate;
    dropoff_point: Coordinate;
    status: RideStatus;
    distance: number;
    time: number;
    selected_fare: FareOption;
    paymentStatus?: PaymentStatus;
    paymentMethod?: string;
    rider: {
        _id: string;
        full_name: string;
        mobile?: string;
        profile_image?: string;
    };
}

export interface IRideCabDetailsResponseDTO {
    driver: {
        _id: string;
        full_name: string;
        mobile?: string;
        profile_image?: string;
    };
    cab: {
        model: string;
        type: string;
        registrationNumber: string;
        images: string[];
    };
}

export interface IRiderPastTripResponseDTO {
    _id: string;
    status: RideStatus;
    pickup_point: Coordinate;
    dropoff_point: Coordinate;
    distance: number;
    time: number;
    selected_fare: FareOption;
    date: string;
    paymentStatus?: string;
}

export interface IDriverPastTripResponseDTO {
    _id: string;
    status: RideStatus;
    pickup_point: Coordinate;
    dropoff_point: Coordinate;
    distance: number;
    time: number;
    selected_fare: FareOption;
    date: string;
    paymentStatus?: string;
}

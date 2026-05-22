import { Coordinate } from "@domain/types/coordinate";
import { FareType } from "@domain/types/fareType";
import { RideEvent } from "@domain/types/rideEvent";
import { RideStatus } from "@domain/types/rideStatus";
import { ROLES } from "@domain/types/roles";

export interface RideDetailsRequestDTO {
  rideId: string;
  userId: string;
}

export interface RideDetailsResponseDTO {
  _id: string;
  status: RideStatus;
  pickup_point: Coordinate;
  dropoff_point: Coordinate;
  distance: number;
  time: number;
  selected_fare: FareType;
  otp: string | null;
  cancelled_by: ROLES | "timeout" | null;
  events: RideEvent[];
}

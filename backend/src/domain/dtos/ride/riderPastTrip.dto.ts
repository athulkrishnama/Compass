import { Coordinate } from "@domain/types/coordinate";
import { FareType } from "@domain/types/fareType";
import { RideStatus } from "@domain/types/rideStatus";

export interface RiderPastTripResponseDTO {
  _id: string;
  status: RideStatus;
  pickup_point: Coordinate;
  dropoff_point: Coordinate;
  distance: number;
  time: number;
  selected_fare: FareType;
  date: string;
  paymentStatus?: string;
}

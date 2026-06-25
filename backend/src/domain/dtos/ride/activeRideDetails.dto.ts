import { Coordinate } from "@domain/types/coordinate";
import { RideStatus } from "@domain/types/rideStatus";

export interface IActiveRideDetailsResponseDTO {
  _id: string;
  pickup_point: Coordinate;
  dropoff_point: Coordinate;
  status: RideStatus;
  distance: number;
  time: number;
  selected_fare: any;
  paymentStatus?: string;
  paymentMethod?: string;
  rider: {
    _id: string;
    full_name: string;
    mobile?: string;
    profile_image?: string;
  };
}

import { Coordinate } from "@domain/types/coordinate";
import { FareStatus } from "@domain/types/fareStatus";
import { VehicleType } from "@domain/types/vehicleType";

export interface FareEntity {
  _id?: string;
  rider_id: string;
  pickup_coordinates: Coordinate;
  drop_coordinates: Coordinate;
  distance_km: number;
  duration_minutes: number;
  fare_options: FareOption[];
  selected_option?: SelectedFare;
  status: FareStatus;
  expires_at: Date;
  created_at: Date;
}

export interface FareOption {
  cab_type: VehicleType;
  total_fare: number;
}

export interface SelectedFare {
  cab_type: VehicleType;
  total_fare: number;
  selected_at: Date;
}

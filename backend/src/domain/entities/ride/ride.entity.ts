import { Coordinate } from "@domain/types/coordinate";
import { RideStatus } from "@domain/types/rideStatus";
import { VehicleType } from "@domain/types/vehicleType";
import { SelectedFare } from "../fare/fare.entity";

export interface RideEntity {
  _id: string;
  rider_id: string;
  driver_id?: string;
  fare_estimate_id: string;
  pickup_coordinates: Coordinate;
  drop_coordinates: Coordinate;
  cab_type: VehicleType;
  fare_snapshot: SelectedFare;
  status: RideStatus;
  current_attempt_id?: string;
  attempted_driver_ids: string[];
  current_radius_km: number;
  actual_distance_km?: number;
  actual_duration_minutes?: number;
  final_fare?: number;
  timeline: RideTimelineEvent[];
  payment_id?: string;
  created_at: Date;
  updated_at: Date;
}

interface RideTimelineEvent {
  event: string;
  actor?: string;
  timestamp: Date;
}

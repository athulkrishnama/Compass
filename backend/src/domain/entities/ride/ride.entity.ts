import { Coordinate } from "@domain/types/coordinate";
import { FareType } from "@domain/types/fareType";
import { RideStatus } from "@domain/types/rideStatus";
import { RideEvent } from "@domain/types/rideEvent";
import { ROLES } from "@domain/types/roles";
import { PAYMENT_STATUS } from "@domain/enums/paymentStatus";
import { PAYMENT_METHOD } from "@domain/enums/paymentMethod";

export interface RideEntity {
  _id: string;
  rider_id: string;
  driver_id: string | null;
  fare_id: string;
  selected_fare: FareType;
  distance: number;
  time: number;
  pickup_point: Coordinate;
  dropoff_point: Coordinate;
  attempted_drivers: string[];
  attempt_id: string | null;
  otp: string | null;
  otp_attempts: number;
  status: RideStatus;
  cancelled_by: ROLES | "timeout" | null;
  events: RideEvent[];
  paymentStatus?: PAYMENT_STATUS;
  paymentMethod?: PAYMENT_METHOD;
  remainingAmount?: number;
}

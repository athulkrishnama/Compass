import { Coordinate } from "@domain/types/coordinate";

export interface ILocationService {
  getDistanceAndTime(
    pickup: Coordinate,
    dropoff: Coordinate,
  ): Promise<{ distance: number; time: number }>;
}

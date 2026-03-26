import { FareOption } from "@domain/entities/fare/fare.entity";
import { Coordinate } from "@domain/types/coordinate";

export interface ICabPricingService {
  calculateCabPriceAndTime(
    pickup: Coordinate,
    dropoff: Coordinate,
  ): Promise<{ distance: number; time: number; fares: FareOption[] }>;
}

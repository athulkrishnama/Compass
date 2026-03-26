import { Coordinate } from "@domain/types/coordinate";
import { FareOption } from "@domain/entities/fare/fare.entity";

export interface ICalculateFareRequestDTO {
  travelerId: string;
  pickup: Coordinate;
  dropoff: Coordinate;
}

export interface ICalculateFareResponseDTO {
  id: string;
  distance: number;
  time: number;
  fares: FareOption[];
}

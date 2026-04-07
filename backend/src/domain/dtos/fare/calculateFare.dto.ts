import { Coordinate } from "@domain/types/coordinate";
import { FareType } from "@domain/types/fareType";

export interface ICalculateFareRequestDTO {
  travelerId: string;
  pickup: Coordinate;
  dropoff: Coordinate;
}

export interface ICalculateFareResponseDTO {
  id: string;
  distance: number;
  time: number;
  fares: FareType[];
}

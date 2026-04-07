import type { Coordinate } from '../../coordinate';

export interface ICalculateFareRequestDTO {
    travelerId?: string;
    pickup: Coordinate;
    dropoff: Coordinate;
}


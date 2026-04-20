import type { FareOption } from "../fareOption";

export interface ICalculateFareResponseDTO {
    id: string;
    distance: number;
    time: number;
    fares: FareOption[];
}

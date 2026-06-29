import { RideCabDetailsResponseDTO } from "@domain/dtos/ride/rideCabDetails.dto";

export interface IGetRideCabDetailsUseCase {
  execute(rideId: string): Promise<RideCabDetailsResponseDTO>;
}

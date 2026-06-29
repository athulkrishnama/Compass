import { RideDetailsResponseDTO } from "@domain/dtos/ride/rideDetails.dto";

export interface IGetRiderActiveRideUseCase {
  execute(riderId: string): Promise<RideDetailsResponseDTO | null>;
}

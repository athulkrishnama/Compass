import { IActiveRideDetailsResponseDTO } from "@domain/dtos/ride/activeRideDetails.dto";

export interface IActiveRideDetailsUseCase {
  execute(driverId: string): Promise<null | IActiveRideDetailsResponseDTO>;
}

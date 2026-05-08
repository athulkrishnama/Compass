import {
  RideDetailsRequestDTO,
  RideDetailsResponseDTO,
} from "@domain/dtos/ride/rideDetails.dto";

export interface IGetRideDetailsUseCase {
  execute(data: RideDetailsRequestDTO): Promise<RideDetailsResponseDTO>;
}

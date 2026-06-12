import { IGetRideDetailsUseCase } from "@application/interfaces/useCase/ride/getRideDetailsUseCase.interface";
import { IRideRepo } from "@application/interfaces/repository/ride/ride.repo.interface";
import {
  RideDetailsRequestDTO,
  RideDetailsResponseDTO,
} from "@domain/dtos/ride/rideDetails.dto";
import { ResourceNotFoundException } from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { inject, injectable } from "tsyringe";
import { RideMapper } from "@mappers/rideMapper";

@injectable()
export class GetRideDetailsUseCase implements IGetRideDetailsUseCase {
  constructor(@inject("IRideRepo") private _rideRepo: IRideRepo) {}

  async execute({
    rideId,
    userId,
  }: RideDetailsRequestDTO): Promise<RideDetailsResponseDTO> {
    const ride = await this._rideRepo.findById(rideId);
    if (!ride) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.RIDE_NOT_FOUND,
      );
    }

    if (ride.rider_id !== userId && !ride.attempted_drivers?.includes(userId)) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.RIDE_NOT_FOUND,
      );
    }
    return RideMapper.toRideDetailsResponseDTOFromEntity(ride);
  }
}

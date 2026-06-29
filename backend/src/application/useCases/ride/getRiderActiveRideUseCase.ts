import { IGetRiderActiveRideUseCase } from "@application/interfaces/useCase/ride/getRiderActiveRideUseCase.interface";
import { IRideRepo } from "@application/interfaces/repository/ride/ride.repo.interface";
import { RideDetailsResponseDTO } from "@domain/dtos/ride/rideDetails.dto";
import { inject, injectable } from "tsyringe";
import { RideMapper } from "@mappers/rideMapper";

@injectable()
export class GetRiderActiveRideUseCase implements IGetRiderActiveRideUseCase {
  constructor(@inject("IRideRepo") private _rideRepo: IRideRepo) {}

  async execute(riderId: string): Promise<RideDetailsResponseDTO | null> {
    const ride = await this._rideRepo.fetchRiderActiveRide(riderId);

    if (!ride) {
      return null;
    }

    return RideMapper.toRideDetailsResponseDTOFromEntity(ride);
  }
}

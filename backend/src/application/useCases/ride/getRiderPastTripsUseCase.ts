import { IGetRiderPastTripsUseCase } from "@application/interfaces/useCase/ride/getRiderPastTripsUseCase.interface";
import { IRideRepo } from "@application/interfaces/repository/ride/ride.repo.interface";
import { RiderPastTripResponseDTO } from "@domain/dtos/ride/riderPastTrip.dto";
import { RideMapper } from "@mappers/rideMapper";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetRiderPastTripsUseCase implements IGetRiderPastTripsUseCase {
  constructor(@inject("IRideRepo") private _rideRepo: IRideRepo) {}

  async execute(
    riderId: string,
    page: number,
    limit: number,
  ): Promise<{ trips: RiderPastTripResponseDTO[]; total: number }> {
    const { trips: pastTrips, total } =
      await this._rideRepo.fetchRiderPastTrips(riderId, page, limit);
    return {
      trips: pastTrips.map(RideMapper.toRiderPastTripResponseDTO),
      total,
    };
  }
}

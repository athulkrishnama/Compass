import { IGetDriverPastTripsUseCase } from "@application/interfaces/useCase/ride/getDriverPastTripsUseCase.interface";
import { IRideRepo } from "@application/interfaces/repository/ride/ride.repo.interface";
import { DriverPastTripResponseDTO } from "@domain/dtos/ride/driverPastTrip.dto";
import { RideMapper } from "@mappers/rideMapper";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetDriverPastTripsUseCase implements IGetDriverPastTripsUseCase {
  constructor(@inject("IRideRepo") private _rideRepo: IRideRepo) {}

  async execute(
    driverId: string,
    page: number,
    limit: number,
  ): Promise<{ trips: DriverPastTripResponseDTO[]; total: number }> {
    const { trips: pastTrips, total } =
      await this._rideRepo.fetchDriverPastTrips(driverId, page, limit);
    return {
      trips: pastTrips.map(RideMapper.toDriverPastTripResponseDTO),
      total,
    };
  }
}

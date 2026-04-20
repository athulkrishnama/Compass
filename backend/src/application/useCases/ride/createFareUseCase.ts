import { ICreateFareUseCase } from "@application/interfaces/useCase/ride/createFareUseCase.interface";
import {
  ICalculateFareRequestDTO,
  ICalculateFareResponseDTO,
} from "@domain/dtos/fare/calculateFare.dto";
import { ILocationService } from "@application/interfaces/service/locationService.interface";
import { inject, injectable } from "tsyringe";
import { FARE_MULTIPLIERS } from "@domain/constants/fareMultipliers";
import { VEHICLE_TYPES } from "@domain/types/vehicleType";
import { IFareRepo } from "@application/interfaces/repository/fare/fare.repo.interface";
import { FareEntity } from "@domain/entities/fare/fare.entity";
import { FARE_STATUS } from "@domain/types/fareStatus";

@injectable()
export class CreateFareUseCase implements ICreateFareUseCase {
  constructor(
    @inject("ILocationService") private _locationService: ILocationService,
    @inject("IFareRepo") private _fareRepo: IFareRepo,
  ) {}

  async execute(
    dto: ICalculateFareRequestDTO,
  ): Promise<ICalculateFareResponseDTO> {
    const { pickup, dropoff, travelerId } = dto;

    const { distance, time } = await this._locationService.getDistanceAndTime(
      pickup,
      dropoff,
    );

    const distanceInKm = distance / 1000;
    const timeInMinutes = time / 60;

    const fares = VEHICLE_TYPES.map((cab_type) => {
      const multiplier = FARE_MULTIPLIERS[cab_type];
      const fareValue =
        multiplier.baseFare +
        distanceInKm * multiplier.perKm +
        timeInMinutes * multiplier.perMinute;

      return {
        cab_type,
        fare: Math.round(fareValue),
      };
    });

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 5 * 60000);

    const fareEntity: FareEntity = {
      _id: "",
      rider_id: travelerId,
      pickup_location: pickup,
      dropoff_location: dropoff,
      distance,
      time,
      created_at: now,
      expires_at: expiresAt,
      status: FARE_STATUS.CREATED,
      fares,
    };

    const fareId = await this._fareRepo.create(fareEntity);

    return {
      id: fareId,
      distance,
      time,
      fares,
    };
  }
}

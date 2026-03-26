import { ICabPricingService } from "@application/interfaces/service/cabPricingService.interface";
import {
  ICalculateFareRequestDTO,
  ICalculateFareResponseDTO,
  ICalculateFareUseCase,
} from "@application/interfaces/useCase/fare/calculateFareUseCase.interface";
import { inject, injectable } from "tsyringe";
import { IFareRepo } from "@application/interfaces/repository/fare/fare.repo.interface";
import { FareEntity } from "@domain/entities/fare/fare.entity";

@injectable()
export class CalculateFareUseCase implements ICalculateFareUseCase {
  constructor(
    @inject("ICabPricingService")
    private _cabPricingService: ICabPricingService,
    @inject("IFareRepo")
    private _fareRepo: IFareRepo,
  ) {}

  async execute(
    data: ICalculateFareRequestDTO,
  ): Promise<ICalculateFareResponseDTO> {
    const calculation = await this._cabPricingService.calculateCabPriceAndTime(
      data.pickup,
      data.dropoff,
    );

    const fareEntity: FareEntity = {
      rider_id: data.travelerId,
      pickup_coordinates: data.pickup,
      drop_coordinates: data.dropoff,
      distance_km: calculation.distance,
      duration_minutes: calculation.time,
      fare_options: calculation.fares,
      status: "PENDING_SELECTION",
      expires_at: new Date(Date.now() + 30 * 60 * 1000),
      created_at: new Date(),
    };

    const fareId = await this._fareRepo.create(fareEntity);

    return {
      id: fareId,
      distance: calculation.distance,
      time: calculation.time,
      fares: calculation.fares,
    };
  }
}

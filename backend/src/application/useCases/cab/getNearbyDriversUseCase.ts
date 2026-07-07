import {
  INearbyDriverResponseDTO,
  INearbyDriversRequestDTO,
} from "@domain/dtos/cab/nearbyDrivers.dto";
import { IGetNearbyDriversUseCase } from "@application/interfaces/useCase/cab/getNearbyDriversUseCase.interface";
import { inject, injectable } from "tsyringe";
import { IGeoService } from "@application/interfaces/service/geoService.interface";

@injectable()
export class GetNearbyDriversUseCase implements IGetNearbyDriversUseCase {
  constructor(@inject("IGeoService") private _geoService: IGeoService) {}

  async execute(
    dto: INearbyDriversRequestDTO,
  ): Promise<INearbyDriverResponseDTO[]> {
    return await this._geoService.getAllNearbyDrivers(dto.coordinates, 5);
  }
}

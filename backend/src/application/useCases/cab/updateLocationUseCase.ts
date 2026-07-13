import { ILocationUpdateRequestDTO } from "@domain/dtos/cab/locationUpdate.dto";
import { IUpdateLocationUseCase } from "@application/interfaces/useCase/cab/updateLocationUseCase.interface";
import { inject, injectable } from "tsyringe";
import { IGeoService } from "@application/interfaces/service/geoService.interface";

@injectable()
export class UpdateLocationUseCase implements IUpdateLocationUseCase {
  constructor(@inject("IGeoService") private _geoService: IGeoService) {}
  async execute(dto: ILocationUpdateRequestDTO): Promise<void> {
    await this._geoService.addDriverLocation(
      dto.user_id,
      dto.coordinates,
      dto.vehicle_type,
      dto.heading,
    );
  }
}

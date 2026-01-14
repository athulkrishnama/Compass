import { IListDestinationsUseCase } from "@application/interfaces/useCase/admin/ListDestinationsUseCase.interface";
import {
  IListDestinationRequestDTO,
  IListDestinationResponseDTO,
} from "@domain/dtos/admin/listDestinations.dto";
import { inject, injectable } from "tsyringe";
import { IDestinationRepo } from "@application/interfaces/repository/destination/destination.repo.interface";
import { DestinationMapper } from "@mappers/destination.mapper";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { env } from "@config/envConfig";

@injectable()
export class ListDestinationsUseCase implements IListDestinationsUseCase {
  constructor(
    @inject("IDestinationRepo") private _destinationRepo: IDestinationRepo,
    @inject("IStorageService") private _storageService: IStorageService,
  ) {}

  async execute(
    dto: IListDestinationRequestDTO,
  ): Promise<IListDestinationResponseDTO> {
    const { destinations, totalDestinations, pageNo, totalPages } =
      await this._destinationRepo.findByQuery(dto);

    const promises = destinations.map(async (destination) => {
      destination.coverImage = await this._storageService.createSignedUrl(
        destination.coverImage,
        env.SIGNED_URL_EXPIRY,
      );
    });
    await Promise.all(promises);

    return DestinationMapper.toListDestinationResponseDTOfromEntity(
      destinations,
      pageNo,
      totalPages,
      totalDestinations,
    );
  }
}

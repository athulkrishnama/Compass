import { IGetDestinationUseCase } from "@application/interfaces/useCase/destination/getDestinationUseCase.interface";
import {
  IGetDestinationRequestDTO,
  IGetDestinationResponseDTO,
} from "@domain/dtos/destination/getDestination.dto";
import { inject, injectable } from "tsyringe";
import { IDestinationRepo } from "@application/interfaces/repository/destination/destination.repo.interface";
import { DestinationMapper } from "@mappers/destination.mapper";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { env } from "@config/envConfig";

@injectable()
export class GetDestinationUseCase implements IGetDestinationUseCase {
  constructor(
    @inject("IDestinationRepo") private _destinationRepo: IDestinationRepo,
    @inject("IStorageService") private _storageService: IStorageService,
  ) {}
  async execute(
    data: IGetDestinationRequestDTO,
  ): Promise<IGetDestinationResponseDTO> {
    const result = await this._destinationRepo.advancedFindByQuery(data);

    const promises = result.destinations.map(async (destination) => {
      destination.coverImage = await this._storageService.createSignedUrl(
        destination.coverImage,
        env.SIGNED_URL_EXPIRY,
      );
    });

    await Promise.all(promises);

    return DestinationMapper.toGetDestinationResponseDTOfromEntity(
      result.destinations,
      data.pageNo,
    );
  }
}

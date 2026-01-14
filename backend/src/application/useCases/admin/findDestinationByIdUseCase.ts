import { ResourceNotFoundException } from "@application/constants/Exceptions";
import { IDestinationRepo } from "@application/interfaces/repository/destination/destination.repo.interface";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { IFindDestinationByIdUseCase } from "@application/interfaces/useCase/admin/findDestinationByIdUseCase.interface";
import { env } from "@config/envConfig";
import { IFindDestinationByIdResponseDto } from "@domain/dtos/admin/findDestinationById.dto";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { DestinationMapper } from "@mappers/destination.mapper";
import { inject, injectable } from "tsyringe";

@injectable()
export class FindDestinationByIdUseCase implements IFindDestinationByIdUseCase {
  constructor(
    @inject("IDestinationRepo")
    private _destinationRepository: IDestinationRepo,
    @inject("IStorageService")
    private _storageService: IStorageService,
  ) {}
  async execute(id: string): Promise<IFindDestinationByIdResponseDto> {
    const destination = await this._destinationRepository.findById(id);

    if (!destination) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.DESTINATION_NOT_FOUND,
      );
    }

    destination.coverImage = await this._storageService.createSignedUrl(
      destination.coverImage,
      env.SIGNED_URL_EXPIRY,
    );

    destination.images = await Promise.all(
      destination.images.map(async (image) => {
        return this._storageService.createSignedUrl(
          image,
          env.SIGNED_URL_EXPIRY,
        );
      }),
    );
    return DestinationMapper.toFindDestinationByIdResponseDTOfromEntity(
      destination,
    );
  }
}

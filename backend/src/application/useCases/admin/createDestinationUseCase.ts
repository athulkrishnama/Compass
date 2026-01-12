import { ICreateDestinationRequestDTO } from "@domain/dtos/admin/createDestination.dto";
import { ICreateDestinationUseCase } from "@application/interfaces/useCase/admin/createDestinationUseCase.interface";
import { inject, injectable } from "tsyringe";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { IDestinationRepo } from "@application/interfaces/repository/destination/destination.repo.interface";
import { StorageFolderNames } from "@application/constants/storageFolderNames";
import { DestinationMapper } from "@mappers/destination.mapper";

@injectable()
export class CreateDestinationUseCase implements ICreateDestinationUseCase {
  constructor(
    @inject("IStorageService") private _storageService: IStorageService,
    @inject("IDestinationRepo")
    private _destinationRepository: IDestinationRepo,
  ) {}
  async create(data: ICreateDestinationRequestDTO): Promise<void> {
    const uploadPromises = data.images.map((image, i) =>
      this._storageService.upload(
        image,
        `${StorageFolderNames.DESTINATION_IMAGE}/${Date.now()}-${i}`,
      ),
    );
    const imageKeys = await Promise.all(uploadPromises);

    const coverImage = await this._storageService.upload(
      data.coverImage,
      `${StorageFolderNames.DESTINATION_COVER_IMAGE}/${Date.now()}`,
    );

    const destination = DestinationMapper.toEntityFromCreateDestinationDTO({
      ...data,
      images: imageKeys,
      coverImage,
    });

    await this._destinationRepository.create(destination);
  }
}

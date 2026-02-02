import { ICreateDestinationRequestDTO } from "@domain/dtos/admin/createDestination.dto";
import { ICreateDestinationUseCase } from "@application/interfaces/useCase/admin/createDestinationUseCase.interface";
import { inject, injectable } from "tsyringe";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { IDestinationRepo } from "@application/interfaces/repository/destination/destination.repo.interface";
import { StorageFolderNames } from "@application/constants/storageFolderNames";
import { DestinationMapper } from "@mappers/destination.mapper";
import { fileResizer, webpConverter } from "@presentation/utils/Fileconverter";
import { VALUES } from "@presentation/constants/values";

@injectable()
export class CreateDestinationUseCase implements ICreateDestinationUseCase {
  constructor(
    @inject("IStorageService") private _storageService: IStorageService,
    @inject("IDestinationRepo")
    private _destinationRepository: IDestinationRepo,
  ) {}
  async create(data: ICreateDestinationRequestDTO): Promise<void> {
    const uploadPromises = data.images.map(async (image, i) => {
      const resizedImage = await fileResizer(
        image,
        VALUES.DESTINATION_GALLERY_IMAGE_MAX_WIDTH,
      );
      const webpImage = await webpConverter(resizedImage);
      return await this._storageService.upload(
        webpImage,
        `${StorageFolderNames.DESTINATION_IMAGE}/${Date.now()}-${i}`,
      );
    });
    const imageKeys = await Promise.all(uploadPromises);

    const resizedImage = await fileResizer(
      data.coverImage,
      VALUES.DESTINATION_COVER_IMAGE_MAX_WIDTH,
    );
    const webpImage = await webpConverter(resizedImage);
    const coverImage = await this._storageService.upload(
      webpImage,
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

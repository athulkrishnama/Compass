import {
  RequiredDataMissingException,
  ResourceNotFoundException,
} from "@application/constants/Exceptions";
import { StorageFolderNames } from "@application/constants/storageFolderNames";
import { ICabRepo } from "@application/interfaces/repository/cab/cab.repo.interface";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { IUpdateVehicleUseCase } from "@application/interfaces/useCase/cab/updateVehicleUseCase.interface";
import { IUpdateVehicleRequestDTO } from "@domain/dtos/cab/updateVehicle.dto";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { VALUES } from "@presentation/constants/values";
import { fileResizer, webpConverter } from "@presentation/utils/Fileconverter";
import { inject, injectable } from "tsyringe";

@injectable()
export class UpdateVehicleUseCase implements IUpdateVehicleUseCase {
  constructor(
    @inject("ICabRepo") private _cabRepo: ICabRepo,
    @inject("IStorageService") private _storageService: IStorageService,
  ) {}

  async execute(dto: IUpdateVehicleRequestDTO): Promise<void> {
    const cab = await this._cabRepo.findByUserId(dto.userId);

    if (!cab || !cab._id) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.CAB_NOT_FOUND,
      );
    }

    if (dto.isOnline !== undefined) {
      cab.isOnline = dto.isOnline;
    }
    if (dto.baseLocation) {
      cab.baseLocation = dto.baseLocation;
    }
    if (cab.vehicleDetails) {
      if (dto.model) cab.vehicleDetails.model = dto.model;
      if (dto.type) cab.vehicleDetails.type = dto.type;
      if (dto.registrationNumber)
        cab.vehicleDetails.registrationNumber = dto.registrationNumber;
    }

    if (
      cab.vehicleDetails &&
      (!cab.vehicleDetails.model || !cab.vehicleDetails?.type)
    ) {
      throw new RequiredDataMissingException(
        INTERNAL_ERROR_MESSAGES.VEHICLE_INFO_INCOMPLETE,
      );
    }
    let imageKeys = cab.vehicleDetails?.images ?? [];

    if (dto.images?.length) {
      const timestamp = Date.now();
      const keys = await Promise.all(
        dto.images.map(async (image, index) => {
          const resizedImage = await fileResizer(
            image,
            VALUES.CAB_IMAGE_MAX_WIDTH,
          );
          const webpImage = await webpConverter(resizedImage);
          return this._storageService.upload(
            webpImage,
            `${StorageFolderNames.CAB_VEHICLE_IMAGE}/${dto.userId}/${timestamp}-${index}`,
          );
        }),
      );

      imageKeys = [...imageKeys, ...keys];
    }
    if (cab.vehicleDetails) cab.vehicleDetails.images = imageKeys;
    await this._cabRepo.update(cab, cab._id);
  }
}

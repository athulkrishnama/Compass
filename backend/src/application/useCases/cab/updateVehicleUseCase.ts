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
        dto.images.map((image, index) =>
          this._storageService.upload(
            image,
            `${StorageFolderNames.CAB_VEHICLE_IMAGE}/${dto.userId}/${timestamp}-${index}`,
          ),
        ),
      );

      imageKeys = [...imageKeys, ...keys];
    }
    if (cab.vehicleDetails) cab.vehicleDetails.images = imageKeys;
    await this._cabRepo.update(cab, cab._id);
  }
}

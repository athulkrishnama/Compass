import { IUpdateDestinationUseCase } from "@application/interfaces/useCase/admin/updateDestinationUseCase.interface";
import { IDestinationRepo } from "@application/interfaces/repository/destination/destination.repo.interface";
import { IUpdateDestinationRequestDTO } from "@domain/dtos/admin/updateDestination.dto";
import { injectable, inject } from "tsyringe";
import { ResourceNotFoundException } from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { StorageFolderNames } from "@application/constants/storageFolderNames";

@injectable()
export class UpdateDestinationUseCase implements IUpdateDestinationUseCase {
  constructor(
    @inject("IDestinationRepo")
    private _destinationRepo: IDestinationRepo,
    @inject("IStorageService") private _storageService: IStorageService,
  ) {}

  async execute(requestDto: IUpdateDestinationRequestDTO): Promise<void> {
    const destination = await this._destinationRepo.findById(requestDto.id);

    if (!destination) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.DESTINATION_NOT_FOUND,
      );
    }

    if (requestDto.name) destination.name = requestDto.name;
    if (requestDto.tagline) destination.tagline = requestDto.tagline;
    if (requestDto.description)
      destination.description = requestDto.description;

    if (requestDto.coverImage) {
      const imageKey = `${StorageFolderNames.DESTINATION_COVER_IMAGE}/${Date.now()}`;
      await this._storageService.upload(requestDto.coverImage, imageKey);
      destination.coverImage = imageKey;
    }

    if (requestDto.images) {
      const uploadPromises = requestDto.images.map((image, i) =>
        this._storageService.upload(
          image,
          `${StorageFolderNames.DESTINATION_IMAGE}/${Date.now()}-${i}`,
        ),
      );
      const imageKeys = await Promise.all(uploadPromises);
      destination.images = [...destination.images, ...imageKeys];
    }

    if (requestDto.country) destination.country = requestDto.country;
    if (requestDto.city) destination.city = requestDto.city;
    if (requestDto.pincode) destination.pincode = requestDto.pincode;
    if (requestDto.coordinates)
      destination.coordinates = requestDto.coordinates;

    if (requestDto.type) destination.type = requestDto.type;
    if (requestDto.activities) destination.activities = requestDto.activities;
    if (requestDto.bestTimeToVisit)
      destination.bestTimeToVisit = requestDto.bestTimeToVisit;

    if (typeof requestDto.isWheelChairAccessible !== "undefined")
      destination.isWheelChairAccessible = requestDto.isWheelChairAccessible;
    if (typeof requestDto.isFree !== "undefined")
      destination.isFree = requestDto.isFree;
    if (typeof requestDto.isAlwaysOpen !== "undefined")
      destination.isAlwaysOpen = requestDto.isAlwaysOpen;
    if (typeof requestDto.entryFee !== "undefined")
      destination.entryFee = requestDto.entryFee;
    if (typeof requestDto.isActive !== "undefined")
      destination.isActive = requestDto.isActive;

    if (typeof requestDto.openingTime !== "undefined")
      destination.openingTime = requestDto.openingTime;
    if (typeof requestDto.closingTime !== "undefined")
      destination.closingTime = requestDto.closingTime;
    if (requestDto.closedDays) destination.closedDays = requestDto.closedDays;
    if (requestDto.isActive) destination.isActive = requestDto.isActive;

    await this._destinationRepo.update(destination, requestDto.id);
  }
}

import {
  InvalidOperationException,
  ResourceNotFoundException,
} from "@application/constants/Exceptions";
import { StorageFolderNames } from "@application/constants/storageFolderNames";
import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { IEditHotelUseCase } from "@application/interfaces/useCase/hotel/editHotelUseCase.interface";
import { IEditHotelRequestDTO } from "@domain/dtos/hotel/editHotel.dto";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { VALUES } from "@presentation/constants/values";
import { fileResizer, webpConverter } from "@presentation/utils/Fileconverter";
import { inject, injectable } from "tsyringe";

@injectable()
export class EditHotelUseCase implements IEditHotelUseCase {
  constructor(
    @inject("IHotelRepo")
    private _hotelRepository: IHotelRepo,
    @inject("IStorageService") private _storageService: IStorageService,
  ) {}

  async execute(dto: IEditHotelRequestDTO): Promise<void> {
    const hotel = await this._hotelRepository.findById(dto.id);

    if (!hotel) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.HOTEL_NOT_FOUND,
      );
    }

    if (hotel.userId !== dto.userId) {
      throw new InvalidOperationException(
        INTERNAL_ERROR_MESSAGES.USER_IS_NOT_AUTHORIZED,
      );
    }

    if (dto.name) hotel.name = dto.name;
    if (dto.description) hotel.description = dto.description;

    if (dto.images) {
      const imageKeys = await Promise.all(
        dto.images.map(async (image, i) => {
          const resizedImage = await fileResizer(
            image,
            VALUES.HOTEL_GALLERY_IMAGE_MAX_WIDTH,
          );
          const webpImage = await webpConverter(resizedImage);
          return this._storageService.upload(
            webpImage,
            `${StorageFolderNames.HOTEL_IMAGE}/${Date.now()}-${i}`,
          );
        }),
      );
      hotel.images = [...hotel.images, ...imageKeys];
    }
    if (dto.coverImage) {
      const resizedImage = await fileResizer(
        dto.coverImage,
        VALUES.HOTEL_COVER_IMAGE_MAX_WIDTH,
      );
      const webpImage = await webpConverter(resizedImage);
      const imageKey = await this._storageService.upload(
        webpImage,
        `${StorageFolderNames.HOTEL_COVER_IMAGE}/${Date.now()}`,
      );
      hotel.coverImage = imageKey;
    }

    if (dto.country) hotel.address.country = dto.country;
    if (dto.city) hotel.address.city = dto.city;
    if (dto.landMark) hotel.address.landMark = dto.landMark;
    if (dto.pinCode) hotel.address.pinCode = dto.pinCode;
    if (dto.coordinates) hotel.address.coordinates = dto.coordinates;

    await this._hotelRepository.update(hotel, dto.id);
  }
}

import {
  InvalidOperationException,
  ResourceNotFoundException,
} from "@application/constants/Exceptions";
import { StorageFolderNames } from "@application/constants/storageFolderNames";
import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";
import { IRoomVariantRepo } from "@application/interfaces/repository/roomVariant/roomVariant.repo.interface";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { IEditRoomVariantUseCase } from "@application/interfaces/useCase/roomVariant/editRoomVariantUseCase.interface";
import { IEditRoomVariantRequestDTO } from "@domain/dtos/roomVariant/editRoomVariant.dto";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { inject, injectable } from "tsyringe";

@injectable()
export class EditRoomVariantUseCase implements IEditRoomVariantUseCase {
  constructor(
    @inject("IRoomVariantRepo")
    private _roomVariantRepository: IRoomVariantRepo,
    @inject("IStorageService")
    private _storageService: IStorageService,
    @inject("IHotelRepo")
    private _hotelRepository: IHotelRepo,
  ) {}

  async execute(data: IEditRoomVariantRequestDTO): Promise<void> {
    const roomVariant = await this._roomVariantRepository.findById(
      data.roomVariantId,
    );
    if (!roomVariant) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.ROOM_VARIANT_NOT_FOUND,
      );
    }

    const hotel = await this._hotelRepository.findById(roomVariant.hotelId);
    if (!hotel) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.HOTEL_NOT_FOUND,
      );
    }

    if (hotel.userId !== data.userId) {
      throw new InvalidOperationException(
        INTERNAL_ERROR_MESSAGES.USER_IS_NOT_AUTHORIZED,
      );
    }

    let coverImageUrl = roomVariant.coverImage;
    if (data.coverImage) {
      await this._storageService.delete(roomVariant.coverImage);
      coverImageUrl = await this._storageService.upload(
        data.coverImage,
        `${StorageFolderNames.ROOM_VARIANT_COVER_IMAGE}/${Date.now()}`,
      );
    }

    let galleryImages = roomVariant.images;
    if (data.images && data.images.length > 0) {
      const promises = data.images.map((img, i) =>
        this._storageService.upload(
          img,
          `${StorageFolderNames.ROOM_VARIANT_IMAGE}/${Date.now()}-${i}`,
        ),
      );
      const newImages = await Promise.all(promises);
      galleryImages = [...roomVariant.images, ...newImages];
    }

    const updatedRoomVariant = {
      ...roomVariant,
      name: data.name ?? roomVariant.name,
      description: data.description ?? roomVariant.description,
      maxOccupancy: data.maxOccupancy ?? roomVariant.maxOccupancy,
      bedConfig: data.bedConfig ?? roomVariant.bedConfig,
      amenities: data.amenities ?? roomVariant.amenities,
      policies: data.policies ?? roomVariant.policies,
      basePrice: data.basePrice ?? roomVariant.basePrice,
      coverImage: coverImageUrl,
      images: galleryImages,
    };

    await this._roomVariantRepository.update(
      updatedRoomVariant,
      data.roomVariantId,
    );
  }
}

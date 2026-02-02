import { ICreateRoomVariantRequestDTO } from "@domain/dtos/roomVariant/createRoomVariant.dto";
import { inject, injectable } from "tsyringe";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import {
  ConflictException,
  ResourceNotFoundException,
} from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { StorageFolderNames } from "@application/constants/storageFolderNames";
import { RoomVariantMapper } from "@mappers/roomVariant.mapper";
import { ICreateRoomVariantUseCase } from "@application/interfaces/useCase/roomVariant/createRoomVariantUseCase.interface";
import { IRoomVariantRepo } from "@application/interfaces/repository/roomVariant/roomVariant.repo.interface";
import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";
import { fileResizer, webpConverter } from "@presentation/utils/Fileconverter";
import { VALUES } from "@presentation/constants/values";

@injectable()
export class CreateRoomVariantUseCase implements ICreateRoomVariantUseCase {
  constructor(
    @inject("IRoomVariantRepo")
    private _roomVariantRepository: IRoomVariantRepo,
    @inject("IHotelRepo") private _hotelRepository: IHotelRepo,
    @inject("IStorageService") private _storageService: IStorageService,
  ) {}

  async execute(data: ICreateRoomVariantRequestDTO): Promise<void> {
    const hotel = await this._hotelRepository.findById(data.hotelId);

    if (!hotel) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.HOTEL_NOT_FOUND,
      );
    }

    const existingRoomVariant = await this._roomVariantRepository.findByName(
      data.hotelId,
      data.name,
    );

    if (existingRoomVariant) {
      throw new ConflictException(
        INTERNAL_ERROR_MESSAGES.ROOM_VARIANT_ALREADY_EXISTS,
      );
    }

    const resizedImage = await fileResizer(
      data.coverImage,
      VALUES.HOTEL_ROOM_COVER_IMAGE_MAX_WIDTH,
    );
    const webpImage = await webpConverter(resizedImage);
    const coverImage = await this._storageService.upload(
      webpImage,
      `${StorageFolderNames.ROOM_VARIANT_COVER_IMAGE}/${Date.now()}`,
    );

    const promises = data.images.map(async (img, i) => {
      const resizedImage = await fileResizer(
        img,
        VALUES.HOTEL_ROOM_IMAGE_MAX_WIDTH,
      );
      const webpImage = await webpConverter(resizedImage);
      return this._storageService.upload(
        webpImage,
        `${StorageFolderNames.ROOM_VARIANT_IMAGE}/${Date.now()}-${i}`,
      );
    });

    const images = await Promise.all(promises);

    const roomVariant = RoomVariantMapper.toEntityFromCreateRoomVariantDTO({
      ...data,
      coverImage,
      images,
    });

    await this._roomVariantRepository.create(roomVariant);
  }
}

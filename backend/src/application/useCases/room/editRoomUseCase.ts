import {
  InvalidOperationException,
  ResourceNotFoundException,
} from "@application/constants/Exceptions";
import { StorageFolderNames } from "@application/constants/storageFolderNames";
import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";
import { IRoomRepo } from "@application/interfaces/repository/room/room.repo.interface";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { IEditRoomUseCase } from "@application/interfaces/useCase/room/editRoomUseCase.interface";
import { IEditRoomRequestDTO } from "@domain/dtos/room/editRoom.dto";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { inject, injectable } from "tsyringe";

@injectable()
export class EditRoomUseCase implements IEditRoomUseCase {
  constructor(
    @inject("IRoomRepo")
    private _roomRepository: IRoomRepo,
    @inject("IStorageService")
    private _storageService: IStorageService,
    @inject("IHotelRepo")
    private _hotelRepository: IHotelRepo,
  ) {}

  async execute(data: IEditRoomRequestDTO): Promise<void> {
    const room = await this._roomRepository.findById(data.roomId);
    if (!room) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.ROOM_NOT_FOUND,
      );
    }

    const hotel = await this._hotelRepository.findById(room.hotelId);
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

    let coverImageUrl = room.coverImage;
    if (data.coverImage) {
      await this._storageService.delete(room.coverImage);
      coverImageUrl = await this._storageService.upload(
        data.coverImage,
        `${StorageFolderNames.ROOM_COVER_IMAGE}/${Date.now()}`,
      );
    }

    let galleryImages = room.images;
    if (data.images && data.images.length > 0) {
      const promises = data.images.map((img, i) =>
        this._storageService.upload(
          img,
          `${StorageFolderNames.ROOM_IMAGE}/${Date.now()}-${i}`,
        ),
      );
      const newImages = await Promise.all(promises);
      galleryImages = [...room.images, ...newImages];
    }

    const updatedRoom = {
      ...room,
      name: data.name ?? room.name,
      description: data.description ?? room.description,
      baseOccupancy: data.baseOccupancy ?? room.baseOccupancy,
      maxOccupancy: data.maxOccupancy ?? room.maxOccupancy,
      bedConfig: data.bedConfig ?? room.bedConfig,
      amenities: data.amenities ?? room.amenities,
      policies: data.policies ?? room.policies,
      basePrice: data.basePrice ?? room.basePrice,
      coverImage: coverImageUrl,
      images: galleryImages,
      status: data.status ?? room.status,
    };

    await this._roomRepository.update(updatedRoom, data.roomId);
  }
}

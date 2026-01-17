import {
  ResourceNotFoundException,
  InvalidOperationException,
} from "@application/constants/Exceptions";
import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";
import { IRoomRepo } from "@application/interfaces/repository/room/room.repo.interface";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { IDeleteRoomImageUseCase } from "@application/interfaces/useCase/room/deleteRoomImageUseCase.interface";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { inject, injectable } from "tsyringe";

@injectable()
export class DeleteRoomImageUseCase implements IDeleteRoomImageUseCase {
  constructor(
    @inject("IRoomRepo") private _roomRepo: IRoomRepo,
    @inject("IHotelRepo") private _hotelRepo: IHotelRepo,
    @inject("IStorageService") private _storageService: IStorageService,
  ) {}

  async execute(roomId: string, userId: string, index: number): Promise<void> {
    const room = await this._roomRepo.findById(roomId);
    if (!room) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.ROOM_NOT_FOUND,
      );
    }

    // Verify the room belongs to a hotel owned by this user
    const hotel = await this._hotelRepo.findById(room.hotelId);
    if (!hotel) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.HOTEL_NOT_FOUND,
      );
    }

    if (hotel.userId !== userId) {
      throw new InvalidOperationException(
        INTERNAL_ERROR_MESSAGES.USER_IS_NOT_AUTHORIZED,
      );
    }

    const image = room.images[index];
    if (!image) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.IMAGE_NOT_FOUND,
      );
    }

    await this._storageService.delete(image);
    room.images.splice(index, 1);
    await this._roomRepo.update(room, room._id!);
  }
}

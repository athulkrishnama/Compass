import {
  ConflictException,
  InvalidOperationException,
  ResourceNotFoundException,
} from "@application/constants/Exceptions";
import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";
import { IRoomRepo } from "@application/interfaces/repository/room/room.repo.interface";
import { IEditRoomUseCase } from "@application/interfaces/useCase/room/editRoomUseCase.interface";
import { IEditRoomRequestDTO } from "@domain/dtos/room/editroomDTO";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { inject, injectable } from "tsyringe";

@injectable()
export class EditRoomUseCase implements IEditRoomUseCase {
  constructor(
    @inject("IRoomRepo") private _roomRepo: IRoomRepo,
    @inject("IHotelRepo") private _hotelRepo: IHotelRepo,
  ) {}

  async execute(data: IEditRoomRequestDTO): Promise<void> {
    const room = await this._roomRepo.findById(data.id);
    if (!room) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.ROOM_NOT_FOUND,
      );
    }

    const hotel = await this._hotelRepo.findById(room.hotelId);
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

    if (data.floor) {
      room.floor = data.floor;
    }
    if (data.status) {
      room.status = data.status;
    }
    if (data.roomCode) {
      const existingRoomCode = await this._roomRepo.findRoomByVariantAndCode(
        room.variantId,
        data.roomCode,
      );
      if (existingRoomCode && existingRoomCode._id !== room._id) {
        throw new ConflictException(
          INTERNAL_ERROR_MESSAGES.ROOM_ALREADY_EXISTS,
        );
      }
      room.roomCode = data.roomCode;
    }

    await this._roomRepo.update(room, room._id!);
  }
}

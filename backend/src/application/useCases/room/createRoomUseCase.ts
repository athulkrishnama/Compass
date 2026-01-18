import { ICreateRoomUseCase } from "@application/interfaces/useCase/room/createRoomUseCase.interface";
import { IRoomRepo } from "@application/interfaces/repository/room/room.repo.interface";
import { ICreateRoomRequestDTO } from "@domain/dtos/room/createRoomDTO";
import { inject, injectable } from "tsyringe";
import { RoomMapper } from "@mappers/roomMapper";
import { ConflictException } from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";

@injectable()
export class CreateRoomUseCase implements ICreateRoomUseCase {
  constructor(@inject("IRoomRepo") private _roomRepo: IRoomRepo) {}

  async execute(data: ICreateRoomRequestDTO): Promise<void> {
    const existingRoom = await this._roomRepo.findRoomByVariantAndCode(
      data.variantId,
      data.roomCode,
    );
    if (existingRoom) {
      throw new ConflictException(INTERNAL_ERROR_MESSAGES.ROOM_ALREADY_EXISTS);
    }
    await this._roomRepo.create(
      RoomMapper.toRoomEntityFromCreateRoomRequestDTO(data),
    );
  }
}

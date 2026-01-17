import { ResourceNotFoundException } from "@application/constants/Exceptions";
import { IRoomRepo } from "@application/interfaces/repository/room/room.repo.interface";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { IGetRoomByIdUseCase } from "@application/interfaces/useCase/room/getRoomByIdUseCase.interface";
import { env } from "@config/envConfig";
import { IRoomDetailResponseDTO } from "@domain/dtos/room/getRoomDetail.dto";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { RoomMapper } from "@mappers/room.mapper";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetRoomByIdUseCase implements IGetRoomByIdUseCase {
  constructor(
    @inject("IRoomRepo")
    private readonly _roomRepository: IRoomRepo,
    @inject("IStorageService")
    private readonly _storageService: IStorageService,
  ) {}

  async execute(roomId: string): Promise<IRoomDetailResponseDTO> {
    const room = await this._roomRepository.findById(roomId);
    if (!room) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.ROOM_NOT_FOUND,
      );
    }
    room.coverImage = await this._storageService.createSignedUrl(
      room.coverImage,
      env.SIGNED_URL_EXPIRY,
    );
    room.images = await Promise.all(
      room.images.map((image) =>
        this._storageService.createSignedUrl(image, env.SIGNED_URL_EXPIRY),
      ),
    );
    return RoomMapper.toRoomDetailResponseDTO(room);
  }
}

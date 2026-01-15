import { ICreateRoomRequestDTO } from "@domain/dtos/room/createRoom.dto";
import { inject, injectable } from "tsyringe";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import {
  ConflictException,
  ResourceNotFoundException,
} from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { StorageFolderNames } from "@application/constants/storageFolderNames";
import { RoomMapper } from "@mappers/room.mapper";
import { ICreateRoomUseCase } from "@application/interfaces/useCase/room/createRoomUseCase.interface";
import { IRoomRepo } from "@application/interfaces/repository/room/room.repo.interface";
import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";

@injectable()
export class CreateRoomUseCase implements ICreateRoomUseCase {
  constructor(
    @inject("IRoomRepo") private _roomRepository: IRoomRepo,
    @inject("IHotelRepo") private _hotelRepository: IHotelRepo,
    @inject("IStorageService") private _storageService: IStorageService,
  ) {}

  async execute(data: ICreateRoomRequestDTO): Promise<void> {
    const hotel = await this._hotelRepository.findById(data.hotelId);

    if (!hotel) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.HOTEL_NOT_FOUND,
      );
    }

    const existingRoom = await this._roomRepository.findByCode(
      data.hotelId,
      data.code,
    );

    if (existingRoom) {
      throw new ConflictException(INTERNAL_ERROR_MESSAGES.ROOM_ALREADY_EXISTS);
    }

    const coverImage = await this._storageService.upload(
      data.coverImage,
      `${StorageFolderNames.ROOM_COVER_IMAGE}/${Date.now()}`,
    );

    const promises = data.images.map((img, i) =>
      this._storageService.upload(
        img,
        `${StorageFolderNames.ROOM_IMAGE}/${Date.now()}-${i}`,
      ),
    );

    const images = await Promise.all(promises);

    const room = RoomMapper.toEntityFromCreateRoomDTO({
      ...data,
      coverImage,
      images,
    });

    await this._roomRepository.create(room);
  }
}

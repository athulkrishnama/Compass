import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";
import { IRoomRepo } from "@application/interfaces/repository/room/room.repo.interface";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { IListRoomsByHotelIdUseCase } from "@application/interfaces/useCase/room/listRoomsByHotelIdUseCase.interface";
import { ResourceNotFoundException } from "@application/constants/Exceptions";
import { env } from "@config/envConfig";
import { IRoomListingResponseDTO } from "@domain/dtos/room/roomListing.dto";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { RoomMapper } from "@mappers/room.mapper";
import { inject, injectable } from "tsyringe";

@injectable()
export class ListRoomsByHotelIdUseCase implements IListRoomsByHotelIdUseCase {
  constructor(
    @inject("IRoomRepo") private _roomRepository: IRoomRepo,
    @inject("IHotelRepo") private _hotelRepository: IHotelRepo,
    @inject("IStorageService") private _storageService: IStorageService,
  ) {}

  async execute(hotelId: string): Promise<IRoomListingResponseDTO> {
    const hotel = await this._hotelRepository.findById(hotelId);

    if (!hotel) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.HOTEL_NOT_FOUND,
      );
    }

    const rooms = await this._roomRepository.findByHotelId(hotelId);

    const promises = rooms.map(async (room) => {
      room.coverImage = await this._storageService.createSignedUrl(
        room.coverImage,
        env.SIGNED_URL_EXPIRY,
      );
    });

    await Promise.all(promises);

    return RoomMapper.toRoomListingResponseDTO(rooms);
  }
}

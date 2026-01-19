import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";
import { IRoomVariantRepo } from "@application/interfaces/repository/roomVariant/roomVariant.repo.interface";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { IListRoomVariantsByHotelIdUseCase } from "@application/interfaces/useCase/roomVariant/listRoomVariantsByHotelIdUseCase.interface";
import { ResourceNotFoundException } from "@application/constants/Exceptions";
import { env } from "@config/envConfig";
import { IRoomVariantListingResponseDTO } from "@domain/dtos/roomVariant/roomVariantListing.dto";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { RoomVariantMapper } from "@mappers/roomVariant.mapper";
import { inject, injectable } from "tsyringe";

@injectable()
export class ListRoomVariantsByHotelIdUseCase
  implements IListRoomVariantsByHotelIdUseCase
{
  constructor(
    @inject("IRoomVariantRepo")
    private _roomVariantRepository: IRoomVariantRepo,
    @inject("IHotelRepo") private _hotelRepository: IHotelRepo,
    @inject("IStorageService") private _storageService: IStorageService,
  ) {}

  async execute(hotelId: string): Promise<IRoomVariantListingResponseDTO> {
    const hotel = await this._hotelRepository.findById(hotelId);

    if (!hotel) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.HOTEL_NOT_FOUND,
      );
    }

    const roomVariants =
      await this._roomVariantRepository.findByHotelId(hotelId);

    const promises = roomVariants.map(async (roomVariant) => {
      roomVariant.coverImage = await this._storageService.createSignedUrl(
        roomVariant.coverImage,
        env.SIGNED_URL_EXPIRY,
      );
    });

    await Promise.all(promises);

    return RoomVariantMapper.toRoomVariantListingResponseDTO(roomVariants);
  }
}

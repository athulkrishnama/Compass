import {
  ResourceNotFoundException,
  InvalidOperationException,
} from "@application/constants/Exceptions";
import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";
import { IRoomVariantRepo } from "@application/interfaces/repository/roomVariant/roomVariant.repo.interface";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { IDeleteRoomVariantImageUseCase } from "@application/interfaces/useCase/roomVariant/deleteRoomVariantImageUseCase.interface";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { inject, injectable } from "tsyringe";

@injectable()
export class DeleteRoomVariantImageUseCase
  implements IDeleteRoomVariantImageUseCase
{
  constructor(
    @inject("IRoomVariantRepo") private _roomVariantRepo: IRoomVariantRepo,
    @inject("IHotelRepo") private _hotelRepo: IHotelRepo,
    @inject("IStorageService") private _storageService: IStorageService,
  ) {}

  async execute(
    roomVariantId: string,
    userId: string,
    index: number,
  ): Promise<void> {
    const roomVariant = await this._roomVariantRepo.findById(roomVariantId);
    if (!roomVariant) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.ROOM_VARIANT_NOT_FOUND,
      );
    }

    const hotel = await this._hotelRepo.findById(roomVariant.hotelId);
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

    const image = roomVariant.images[index];
    if (!image) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.IMAGE_NOT_FOUND,
      );
    }

    await this._storageService.delete(image);
    roomVariant.images.splice(index, 1);
    await this._roomVariantRepo.update(roomVariant, roomVariant._id!);
  }
}

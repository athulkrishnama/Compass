import {
  ResourceNotFoundException,
  InvalidOperationException,
} from "@application/constants/Exceptions";
import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { IDeleteHotelImageUseCase } from "@application/interfaces/useCase/hotel/deleteHotelImageUseCase.interface";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { inject, injectable } from "tsyringe";

@injectable()
export class DeleteHotelImageUseCase implements IDeleteHotelImageUseCase {
  constructor(
    @inject("IHotelRepo") private _hotelRepo: IHotelRepo,
    @inject("IStorageService") private _storageService: IStorageService,
  ) {}

  async execute(hotelId: string, userId: string, index: number): Promise<void> {
    const hotel = await this._hotelRepo.findById(hotelId);
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

    const image = hotel.images[index];
    if (!image) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.IMAGE_NOT_FOUND,
      );
    }

    await this._storageService.delete(image);
    hotel.images.splice(index, 1);
    await this._hotelRepo.update(hotel, hotel._id!);
  }
}

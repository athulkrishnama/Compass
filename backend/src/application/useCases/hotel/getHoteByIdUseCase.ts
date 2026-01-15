import { ResourceNotFoundException } from "@application/constants/Exceptions";
import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { IGetHotelByIdUseCase } from "@application/interfaces/useCase/hotel/getHotelByIdUseCase.interface";
import { env } from "@config/envConfig";
import { IGetHotelByIdResponseDTO } from "@domain/dtos/hotel/getHotelById.dto";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { HotelMapper } from "@mappers/hotel.mapper";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetHotelByIdUseCase implements IGetHotelByIdUseCase {
  constructor(
    @inject("IHotelRepo") private _hotelRepo: IHotelRepo,
    @inject("IStorageService") private _storageService: IStorageService,
  ) {}

  async execute(id: string): Promise<IGetHotelByIdResponseDTO> {
    const hotel = await this._hotelRepo.findById(id);

    if (!hotel) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.HOTEL_NOT_FOUND,
      );
    }

    hotel.coverImage = await this._storageService.createSignedUrl(
      hotel.coverImage,
      env.SIGNED_URL_EXPIRY,
    );

    const promises = hotel.images.map((image) =>
      this._storageService.createSignedUrl(image, env.SIGNED_URL_EXPIRY),
    );

    hotel.images = await Promise.all(promises);

    return HotelMapper.toGetHotelByIdResponseDTOfromEntity(hotel);
  }
}

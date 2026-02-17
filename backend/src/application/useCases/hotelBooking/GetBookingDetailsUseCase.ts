import { inject, injectable } from "tsyringe";
import { IGetBookingDetailsUseCase } from "@application/interfaces/useCase/hotelBooking/IGetBookingDetailsUseCase";
import { IHotelBookingRepo } from "@application/interfaces/repository/hotelBooking/hotelBooking.repo.interface";
import { IBookingDetailsResponseDTO } from "@domain/dtos/hotelBooking/bookingDetails.dto";
import { HotelBookingMapper } from "@application/mappers/hotelBookingMapper";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { env } from "@config/envConfig";
import { ResourceNotFoundException } from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";

@injectable()
export class GetBookingDetailsUseCase implements IGetBookingDetailsUseCase {
  constructor(
    @inject("IHotelBookingRepo")
    private _hotelBookingRepo: IHotelBookingRepo,
    @inject("IStorageService")
    private _storageService: IStorageService,
  ) {}

  async execute(
    bookingId: string,
    travelerId: string,
  ): Promise<IBookingDetailsResponseDTO> {
    const data = await this._hotelBookingRepo.getBookingDetailsById(
      bookingId,
      travelerId,
    );

    if (!data) {
      throw new ResourceNotFoundException(INTERNAL_ERROR_MESSAGES.INVALID_ID);
    }

    data.booking.hotel.coverImage = await this._storageService.createSignedUrl(
      data.booking.hotel.coverImage,
      env.SIGNED_URL_EXPIRY,
    );

    data.booking.roomVariant.coverImage =
      await this._storageService.createSignedUrl(
        data.booking.roomVariant.coverImage,
        env.SIGNED_URL_EXPIRY,
      );

    return HotelBookingMapper.toBookingDetailsResponseDTO(data);
  }
}

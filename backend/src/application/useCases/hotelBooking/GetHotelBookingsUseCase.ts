import { inject, injectable } from "tsyringe";
import { IGetHotelBookingsUseCase } from "@application/interfaces/useCase/hotelBooking/IGetHotelBookingsUseCase";
import { IHotelBookingRepo } from "@application/interfaces/repository/hotelBooking/hotelBooking.repo.interface";
import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";
import { IHotelBookingListingResponseDTO } from "@domain/dtos/hotelBooking/hotelBookingListing.dto";
import { HotelBookingMapper } from "@application/mappers/hotelBookingMapper";
import { ResourceNotFoundException } from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { BOOKING_STATUS } from "@domain/enums/bookingStatus";
import { VALUES } from "@presentation/constants/values";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { env } from "@config/envConfig";

@injectable()
export class GetHotelBookingsUseCase implements IGetHotelBookingsUseCase {
  constructor(
    @inject("IHotelBookingRepo")
    private _hotelBookingRepo: IHotelBookingRepo,
    @inject("IHotelRepo")
    private _hotelRepo: IHotelRepo,
    @inject("IStorageService")
    private _storageService: IStorageService,
  ) {}

  async execute(
    userId: string,
    hotelId: string,
    roomVariantId: string | undefined,
    status: BOOKING_STATUS | undefined,
    search: string | undefined,
    pageNo: number,
  ): Promise<IHotelBookingListingResponseDTO> {
    const hotel = await this._hotelRepo.findById(hotelId);
    if (!hotel || hotel.userId !== userId) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.HOTEL_NOT_FOUND,
      );
    }

    const data = await this._hotelBookingRepo.getHotelBookings({
      hotelId,
      roomVariantId,
      bookingStatus: status,
      search,
      pageNo,
    });

    const promises = data.bookings.map(async (b) => {
      if (b.traveler.profile_image)
        b.traveler.profile_image = await this._storageService.createSignedUrl(
          b.traveler.profile_image,
          env.SIGNED_URL_EXPIRY,
        );
    });

    await Promise.all(promises);

    const totalPages = Math.ceil(data.total / VALUES.BOOKINGS_LIMIT);

    return HotelBookingMapper.toHotelBookingListingResponseDTO(
      data,
      totalPages,
      pageNo,
      data.total,
    );
  }
}

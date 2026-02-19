import { inject, injectable } from "tsyringe";
import { IGetTravelerUpcomingBookingsUseCase } from "@application/interfaces/useCase/hotelBooking/IGetTravelerUpcomingBookingsUseCase";
import { IHotelBookingRepo } from "@application/interfaces/repository/hotelBooking/hotelBooking.repo.interface";
import { ITravelerBookingListingResponseDTO } from "@domain/dtos/hotelBooking/travelerBookingListing.dto";
import { HotelBookingMapper } from "@application/mappers/hotelBookingMapper";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { env } from "@config/envConfig";

@injectable()
export class GetTravelerUpcomingBookingsUseCase
  implements IGetTravelerUpcomingBookingsUseCase
{
  constructor(
    @inject("IHotelBookingRepo")
    private _hotelBookingRepo: IHotelBookingRepo,
    @inject("IStorageService")
    private _storageService: IStorageService,
  ) {}

  async execute(
    travelerId: string,
    pageNo: number,
  ): Promise<ITravelerBookingListingResponseDTO> {
    const data = await this._hotelBookingRepo.getTravelerUpcomingBookings(
      travelerId,
      pageNo,
    );
    const promises = data.bookings.map(async (booking) => {
      booking.hotel.coverImage = await this._storageService.createSignedUrl(
        booking.hotel.coverImage,
        env.SIGNED_URL_EXPIRY,
      );
    });
    await Promise.all(promises);
    return HotelBookingMapper.toTravelerBookingListingResponseDTO(data);
  }
}

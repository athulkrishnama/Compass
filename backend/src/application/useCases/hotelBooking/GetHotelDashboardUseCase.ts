import { inject, injectable } from "tsyringe";
import { IGetHotelDashboardUseCase } from "@application/interfaces/useCase/hotelBooking/IGetHotelDashboardUseCase";
import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";
import { IHotelBookingRepo } from "@application/interfaces/repository/hotelBooking/hotelBooking.repo.interface";
import { IRoomVariantRepo } from "@application/interfaces/repository/roomVariant/roomVariant.repo.interface";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { env } from "@config/envConfig";
import { IHotelDashboardResponseDTO } from "@domain/dtos/hotelBooking/hotelDashboard.dto";
import { InvalideDataException } from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { DashboardMapper } from "@application/mappers/dashboardMapper";

@injectable()
export class GetHotelDashboardUseCase implements IGetHotelDashboardUseCase {
  constructor(
    @inject("IHotelRepo") private _hotelRepo: IHotelRepo,
    @inject("IHotelBookingRepo") private _bookingRepo: IHotelBookingRepo,
    @inject("IRoomVariantRepo") private _roomVariantRepo: IRoomVariantRepo,
    @inject("IStorageService") private _storageService: IStorageService,
  ) {}

  async execute(
    userId: string,
    hotelId: string,
  ): Promise<IHotelDashboardResponseDTO> {
    const hotel = await this._hotelRepo.findById(hotelId);
    if (!hotel || hotel.userId !== userId) {
      throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.NOT_ALLOWED);
    }

    const [dashboardStats, roomStats, recentBookings] = await Promise.all([
      this._bookingRepo.getDashboardStats([hotelId]),
      this._roomVariantRepo.getTotalRoomsByHotelIds([hotelId]),
      this._bookingRepo.getRecentBookingsByHotelId(hotelId, 10),
    ]);

    const stats = dashboardStats[0] || {
      todayCheckIns: 0,
      todayCheckOuts: 0,
      activeGuests: 0,
      occupiedRooms: 0,
      totalRevenue: 0,
      totalBookings: 0,
    };
    const totalRooms = roomStats[0]?.totalRooms || 0;

    const coverImage = await this._storageService.createSignedUrl(
      hotel.coverImage,
      env.SIGNED_URL_EXPIRY,
    );

    return DashboardMapper.toHotelDashboardResponseDTO(
      hotel,
      coverImage,
      stats,
      totalRooms,
      recentBookings,
    );
  }
}

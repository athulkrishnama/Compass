import { inject, injectable } from "tsyringe";
import { IGetOverallDashboardUseCase } from "@application/interfaces/useCase/hotelBooking/IGetOverallDashboardUseCase";
import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";
import { IHotelBookingRepo } from "@application/interfaces/repository/hotelBooking/hotelBooking.repo.interface";
import { IRoomVariantRepo } from "@application/interfaces/repository/roomVariant/roomVariant.repo.interface";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { env } from "@config/envConfig";
import { IOverallDashboardResponseDTO } from "@domain/dtos/hotelBooking/overallDashboard.dto";
import { DashboardMapper } from "@application/mappers/dashboardMapper";

@injectable()
export class GetOverallDashboardUseCase implements IGetOverallDashboardUseCase {
  constructor(
    @inject("IHotelRepo") private _hotelRepo: IHotelRepo,
    @inject("IHotelBookingRepo") private _bookingRepo: IHotelBookingRepo,
    @inject("IRoomVariantRepo") private _roomVariantRepo: IRoomVariantRepo,
    @inject("IStorageService") private _storageService: IStorageService,
  ) {}

  async execute(userId: string): Promise<IOverallDashboardResponseDTO> {
    const { hotels } = await this._hotelRepo.getHotelsByUserId(userId);

    if (hotels.length === 0) {
      return {
        totalHotels: 0,
        todayCheckIns: 0,
        todayCheckOuts: 0,
        activeGuests: 0,
        totalRooms: 0,
        occupiedRooms: 0,
        occupancyRate: 0,
        totalRevenue: 0,
        hotels: [],
      };
    }

    const hotelIds = hotels.map((h) => h._id!);

    const [dashboardStats, roomStats] = await Promise.all([
      this._bookingRepo.getDashboardStats(hotelIds),
      this._roomVariantRepo.getTotalRoomsByHotelIds(hotelIds),
    ]);

    const statsMap = new Map(dashboardStats.map((s) => [s.hotelId, s]));
    const roomsMap = new Map(roomStats.map((r) => [r.hotelId, r.totalRooms]));

    let totalCheckIns = 0;
    let totalCheckOuts = 0;
    let totalActiveGuests = 0;
    let totalRooms = 0;
    let totalOccupied = 0;
    let totalRevenue = 0;

    const hotelSummaries = await Promise.all(
      hotels.map(async (hotel) => {
        const stats = statsMap.get(hotel._id!) || {
          todayCheckIns: 0,
          todayCheckOuts: 0,
          activeGuests: 0,
          occupiedRooms: 0,
          totalRevenue: 0,
          totalBookings: 0,
        };
        const rooms = roomsMap.get(hotel._id!) || 0;

        totalCheckIns += stats.todayCheckIns;
        totalCheckOuts += stats.todayCheckOuts;
        totalActiveGuests += stats.activeGuests;
        totalRooms += rooms;
        totalOccupied += stats.occupiedRooms;
        totalRevenue += stats.totalRevenue;

        const coverImage = await this._storageService.createSignedUrl(
          hotel.coverImage,
          env.SIGNED_URL_EXPIRY,
        );

        return DashboardMapper.toHotelSummaryDTO(
          hotel,
          coverImage,
          stats,
          rooms,
        );
      }),
    );

    return DashboardMapper.toOverallDashboardResponseDTO(
      {
        totalHotels: hotels.length,
        todayCheckIns: totalCheckIns,
        todayCheckOuts: totalCheckOuts,
        activeGuests: totalActiveGuests,
        totalRooms,
        occupiedRooms: totalOccupied,
        totalRevenue,
      },
      hotelSummaries,
    );
  }
}

import { inject, injectable } from "tsyringe";
import { IUserRepo } from "@application/interfaces/repository/users/user.repo.interface";
import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";
import { ICabRepo } from "@application/interfaces/repository/cab/cab.repo.interface";
import { IRideRepo } from "@application/interfaces/repository/ride/ride.repo.interface";
import { IHotelBookingRepo } from "@application/interfaces/repository/hotelBooking/hotelBooking.repo.interface";
import { ROLES } from "@domain/enums/roles";
import { IGetAdminDashboardStatsUseCase } from "@application/interfaces/useCase/admin/getAdminDashboardStatsUseCase.interface";
import { DashboardMapper } from "@presentation/mappers/admin/dashboard.mapper";
import { IGetAdminDashboardStatsResponseDTO } from "@domain/dtos/admin/dashboard.dto";

@injectable()
export class GetAdminDashboardStatsUseCase
  implements IGetAdminDashboardStatsUseCase
{
  constructor(
    @inject("IUserRepo") private userRepo: IUserRepo,
    @inject("IHotelRepo") private hotelRepo: IHotelRepo,
    @inject("ICabRepo") private cabRepo: ICabRepo,
    @inject("IRideRepo") private rideRepo: IRideRepo,
    @inject("IHotelBookingRepo") private bookingRepo: IHotelBookingRepo,
  ) {}

  async execute(filter: {
    type: "weekly" | "monthly" | "yearly";
    year?: number;
  }): Promise<IGetAdminDashboardStatsResponseDTO> {
    const [
      totalUsers,
      totalHotels,
      totalCabs,
      totalBookings,
      totalRevenue,
      bookingTrends,
      topHotels,
      bookingStatusDistribution,
      cabRideTrends,
      cabTypeDistribution,
      cabRideStatusDistribution,
    ] = await Promise.all([
      this.userRepo.countUsers(ROLES.TRAVELER),
      this.hotelRepo.countHotels(),
      this.cabRepo.countCabs(),
      this.bookingRepo.countTotalBookings(),
      this.bookingRepo.calculateTotalRevenue(),
      this.bookingRepo.getBookingTrends(filter),
      this.bookingRepo.getTopBookedHotels(5),
      this.bookingRepo.getBookingStatusDistribution(),
      this.rideRepo.getAdminRideTrends(filter),
      this.rideRepo.getCabTypeDistribution(),
      this.rideRepo.getRideStatusDistribution(),
    ]);

    const rawData = {
      cards: {
        totalUsers,
        totalHotels,
        totalCabs,
        totalBookings,
        totalRevenue,
      },
      charts: {
        bookingTrends,
        topHotels,
        bookingStatusDistribution,
        cabRideTrends,
        cabTypeDistribution,
        cabRideStatusDistribution,
      },
    };

    return DashboardMapper.toDTO(rawData);
  }
}

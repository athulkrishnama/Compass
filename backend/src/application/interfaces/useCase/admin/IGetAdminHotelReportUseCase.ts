import { IAdminHotelReportResponseDTO } from "@domain/dtos/ride/driverRideReport.dto";

import { IAdminHotelReportRequestDTO } from "@domain/dtos/hotelBooking/hotelBookingReport.dto";

export interface IGetAdminHotelReportUseCase {
  execute(
    params: IAdminHotelReportRequestDTO,
  ): Promise<IAdminHotelReportResponseDTO>;
}

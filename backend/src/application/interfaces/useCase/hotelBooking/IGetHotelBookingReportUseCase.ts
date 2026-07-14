import {
  IHotelBookingReportRequestDTO,
  IHotelBookingReportResponseDTO,
} from "@domain/dtos/hotelBooking/hotelBookingReport.dto";

export interface IGetHotelBookingReportUseCase {
  execute(
    params: IHotelBookingReportRequestDTO,
  ): Promise<IHotelBookingReportResponseDTO>;
}

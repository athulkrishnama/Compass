import { IAdminHotelReportPdfRequestDTO } from "@domain/dtos/hotelBooking/hotelBookingReport.dto";

export interface IGetAdminHotelReportPdfUseCase {
  execute(params: IAdminHotelReportPdfRequestDTO): Promise<Buffer>;
}

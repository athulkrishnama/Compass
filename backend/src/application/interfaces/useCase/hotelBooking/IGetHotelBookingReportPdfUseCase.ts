import { IHotelBookingReportPdfRequestDTO } from "@domain/dtos/hotelBooking/hotelBookingReport.dto";

export interface IGetHotelBookingReportPdfUseCase {
  execute(params: IHotelBookingReportPdfRequestDTO): Promise<Buffer>;
}

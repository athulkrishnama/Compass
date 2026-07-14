import { inject, injectable } from "tsyringe";
import { IGetAdminHotelReportPdfUseCase } from "@application/interfaces/useCase/admin/IGetAdminHotelReportPdfUseCase";
import { IHotelBookingRepo } from "@application/interfaces/repository/hotelBooking/hotelBooking.repo.interface";
import { IAdminHotelReportPdfRequestDTO } from "@domain/dtos/hotelBooking/hotelBookingReport.dto";
import { BOOKING_STATUS } from "@domain/enums/bookingStatus";
import { IPdfGeneratorService } from "@application/interfaces/service/pdfGenerator.service.interface";

@injectable()
export class GetAdminHotelReportPdfUseCase
  implements IGetAdminHotelReportPdfUseCase
{
  constructor(
    @inject("IHotelBookingRepo") private _hotelBookingRepo: IHotelBookingRepo,
    @inject("IPdfGeneratorService")
    private _pdfGeneratorService: IPdfGeneratorService,
  ) {}

  async execute(params: IAdminHotelReportPdfRequestDTO): Promise<Buffer> {
    const items =
      await this._hotelBookingRepo.getAllAdminHotelBookingsForReport({
        status: params.status as BOOKING_STATUS | undefined,
        search: params.search,
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
      });

    return this._pdfGeneratorService.generateHotelReportPdfBuffer(
      items,
      "Platform Hotel Bookings Report",
    );
  }
}

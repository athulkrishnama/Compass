export interface IPdfGeneratorService {
  generateHotelReportPdfBuffer(
    items: {
      index: number;
      bookingId: string;
      hotelName: string;
      roomVariantName: string;
      guestName: string;
      amount: number;
      bookingStatus: string;
      checkInDate?: string;
      checkOutDate?: string;
    }[],
    title: string,
  ): Promise<Buffer>;

  generateCabReportPdfBuffer(
    items: {
      index: number;
      bookingId: string;
      driverName?: string;
      username: string;
      amount: number;
      status: string;
      date?: string;
    }[],
    title: string,
    includeDriver?: boolean,
  ): Promise<Buffer>;
}

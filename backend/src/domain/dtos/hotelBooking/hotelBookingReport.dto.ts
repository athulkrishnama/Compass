import { BOOKING_STATUS } from "@domain/enums/bookingStatus";

export interface HotelBookingReportItem {
  index: number;
  bookingId: string;
  hotelName: string;
  roomVariantName: string;
  guestName: string;
  amount: number;
  bookingStatus: BOOKING_STATUS;
  checkInDate: string;
  checkOutDate: string;
}

export interface IAdminHotelReportItem extends HotelBookingReportItem {}

export interface IHotelBookingReportResponseDTO {
  items: HotelBookingReportItem[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

export interface IHotelBookingReportRequestDTO {
  userId: string;
  hotelId: string;
  status?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  pageNo: number;
}

export interface IHotelBookingReportPdfRequestDTO {
  userId: string;
  hotelId: string;
  status?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface IAdminHotelReportRequestDTO {
  status?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  pageNo: number;
}

export interface IAdminHotelReportPdfRequestDTO {
  status?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

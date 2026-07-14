export interface DriverRideReportItem {
  index: number;
  bookingId: string;
  username: string;
  amount: number;
  status: string;
  date: string;
}

export interface IDriverRideReportResponseDTO {
  items: DriverRideReportItem[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

export interface IAdminHotelReportItem {
  index: number;
  bookingId: string;
  hotelName: string;
  roomVariantName: string;
  guestName: string;
  amount: number;
  bookingStatus: string;
  checkInDate: string;
  checkOutDate: string;
}

export interface IAdminHotelReportResponseDTO {
  items: IAdminHotelReportItem[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

export interface IAdminCabReportItem {
  index: number;
  bookingId: string;
  driverName: string;
  username: string;
  amount: number;
  status: string;
  date: string;
}

export interface IAdminCabReportResponseDTO {
  items: IAdminCabReportItem[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

export interface IDriverRideReportRequestDTO {
  driverId: string;
  status?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  pageNo: number;
  limit: number;
}

export interface IDriverRideReportPdfRequestDTO {
  driverId: string;
  status?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface IAdminCabReportRequestDTO {
  status?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  pageNo: number;
  limit: number;
}

export interface IAdminCabReportPdfRequestDTO {
  status?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export enum BookingRoutes {
  GET_BOOKING_BY_PAYMENT_ID = "/:paymentId",
  GET_UPCOMING_BOOKINGS = "/upcoming",
  GET_ONGOING_BOOKINGS = "/ongoing",
  GET_COMPLETED_BOOKINGS = "/completed",
  GET_BOOKING_DETAILS = "/details/:bookingId",
  CANCEL_BOOKING = "/cancel/:bookingId",
  OVERALL_DASHBOARD = "/dashboard/overall",
  HOTEL_DASHBOARD = "/dashboard/:hotelId",
  GET_HOTEL_BOOKINGS = "/hotel/:hotelId/bookings",
}

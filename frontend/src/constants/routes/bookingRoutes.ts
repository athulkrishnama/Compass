export enum BookingRoutes {
    BY_PAYMENT_ID = "/bookings/:paymentId",
    UPCOMING = "/bookings/upcoming",
    ONGOING = "/bookings/ongoing",
    COMPLETED = "/bookings/completed",
    DETAILS = "/bookings/details",
    CANCEL = "/bookings/cancel",
    HOTEL_BOOKINGS = "/bookings/hotel",
    AVAILABLE_ROOMS = "/bookings/hotel/:hotelId/bookings/:bookingId/available-rooms",
    CHECK_IN = "/bookings/hotel/:hotelId/bookings/:bookingId/check-in",
    CHECK_OUT = "/bookings/hotel/:hotelId/bookings/:bookingId/check-out",
}

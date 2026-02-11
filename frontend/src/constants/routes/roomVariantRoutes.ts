export enum ROOM_VARIANT_ROUTES {
    BY_HOTEL = "/room-variants/hotel/:hotelId",
    BY_ID = "/room-variants/:id",
    IMAGE = "/room-variants/:id/images/:index",
    AVAILABILITY = "/room-variants/availability/:roomVariantId",
    MARK_AS_UNAVAILABLE = "/room-variants/mark-as-unavailable/:roomVariantId",
    UPDATE_UNAVAILABLE = "/room-variants/unavailable/:id",
}

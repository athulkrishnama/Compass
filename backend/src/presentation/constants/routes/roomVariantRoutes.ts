export enum RoomVariantRoutes {
  INDEX = "/",
  BY_HOTEL = "/hotel/:hotelId",
  BY_ID = "/:id",
  IMAGE = "/:id/images/:index",
  AVAILABILITY = "/availability/:roomVariantId",
  MARK_AS_UNAVAILABLE = "/mark-as-unavailable/:roomVariantId",
  UPDATE_UNAVAILABLE = "/unavailable/:id",
  RESTORE_ROOM = "/restore/:id",
}

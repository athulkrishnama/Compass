export interface IGetRoomAvailabilityRequestDTO {
  checkinDate: Date;
  checkoutDate: Date;
  roomVariantId: string;
}

export interface IGetRoomAvailabilityResponseDTO {
  available: number;
}

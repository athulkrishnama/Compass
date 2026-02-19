export interface ICheckInRequestDTO {
  bookingId: string;
  roomNumber?: number;
}

export interface IAvailableRoomsResponseDTO {
  availableRooms: number[];
  unavailableRooms: { roomNumber: number; reason: string }[];
}

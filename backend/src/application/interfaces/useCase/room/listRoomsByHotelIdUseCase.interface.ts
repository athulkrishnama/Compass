import { IRoomListingResponseDTO } from "@domain/dtos/room/roomListing.dto";

export interface IListRoomsByHotelIdUseCase {
  execute(hotelId: string): Promise<IRoomListingResponseDTO>;
}

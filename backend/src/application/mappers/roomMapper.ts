import { RoomEntity } from "@domain/entities/room/roomEntity";
import { ICreateRoomRequestDTO } from "@domain/dtos/room/createRoomDTO";

export class RoomMapper {
  static toRoomEntityFromCreateRoomRequestDTO(
    data: ICreateRoomRequestDTO,
  ): RoomEntity {
    return {
      hotelId: data.hotelId,
      variantId: data.variantId,
      roomCode: data.roomCode,
      floor: data.floor,
      status: data.status,
    };
  }
}

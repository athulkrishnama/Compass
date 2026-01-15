import { ICreateRoomRequestDTO } from "@domain/dtos/room/createRoom.dto";
import { IRoomListingResponseDTO } from "@domain/dtos/room/roomListing.dto";
import { RoomEntity } from "@domain/entities/room/room.entity";
import { RoomStatus } from "@domain/enums/roomStatus";

export class RoomMapper {
  static toRoomListingResponseDTO(
    rooms: RoomEntity[],
  ): IRoomListingResponseDTO {
    return {
      rooms: rooms.map((room) => ({
        id: room._id!,
        name: room.name,
        code: room.code,
        coverImage: room.coverImage,
        basePrice: room.basePrice,
      })),
      count: rooms.length,
    };
  }

  static toEntityFromCreateRoomDTO(
    data: Omit<ICreateRoomRequestDTO, "coverImage" | "images"> & {
      coverImage: string;
      images: string[];
    },
  ): RoomEntity {
    return {
      hotelId: data.hotelId,
      name: data.name,
      code: data.code,
      description: data.description,
      baseOccupancy: data.baseOccupancy,
      maxOccupancy: data.maxOccupancy,
      bedConfig: {
        type: data.bedConfig.type,
        count: data.bedConfig.count,
      },
      amenities: data.amenities,
      policies: {
        smokingAllowed: data.policies.smokingAllowed,
        petsAllowed: data.policies.petsAllowed,
        checkInTime: data.policies.checkInTime,
        checkOutTime: data.policies.checkOutTime,
      },
      basePrice: data.basePrice,
      coverImage: data.coverImage,
      images: data.images,
      status: RoomStatus.ACTIVE,
    };
  }
}

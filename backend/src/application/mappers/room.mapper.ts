import { ICreateRoomRequestDTO } from "@domain/dtos/room/createRoom.dto";
import { IRoomDetailResponseDTO } from "@domain/dtos/room/getRoomDetail.dto";
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

  static toRoomDetailResponseDTO(room: RoomEntity): IRoomDetailResponseDTO {
    return {
      id: room._id!,
      hotelId: room.hotelId,
      name: room.name,
      code: room.code,
      description: room.description,
      baseOccupancy: room.baseOccupancy,
      maxOccupancy: room.maxOccupancy,
      bedConfig: {
        type: room.bedConfig.type,
        count: room.bedConfig.count,
      },
      amenities: room.amenities,
      policies: {
        smokingAllowed: room.policies.smokingAllowed,
        petsAllowed: room.policies.petsAllowed,
        checkInTime: room.policies.checkInTime,
        checkOutTime: room.policies.checkOutTime,
      },
      basePrice: room.basePrice,
      coverImage: room.coverImage,
      images: room.images,
      status: room.status,
    };
  }
}

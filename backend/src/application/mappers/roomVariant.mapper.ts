import { ICreateRoomVariantRequestDTO } from "@domain/dtos/roomVariant/createRoomVariant.dto";
import { IRoomVariantDetailResponseDTO } from "@domain/dtos/roomVariant/getRoomVariantDetail.dto";
import { IRoomVariantListingResponseDTO } from "@domain/dtos/roomVariant/roomVariantListing.dto";
import { RoomStatusEntity } from "@domain/entities/roomStatus/roomStatus.entity";
import { RoomVariantEntity } from "@domain/entities/roomVariant/roomVariant.entity";

export class RoomVariantMapper {
  static toRoomVariantListingResponseDTO(
    roomVariants: RoomVariantEntity[],
  ): IRoomVariantListingResponseDTO {
    return {
      roomVariants: roomVariants.map((roomVariant) => ({
        id: roomVariant._id!,
        name: roomVariant.name,
        coverImage: roomVariant.coverImage,
        basePrice: roomVariant.basePrice,
        maxOccupancy: roomVariant.maxOccupancy,
        isActive: roomVariant.isActive,
      })),
      count: roomVariants.length,
    };
  }

  static toEntityFromCreateRoomVariantDTO(
    data: Omit<ICreateRoomVariantRequestDTO, "coverImage" | "images"> & {
      coverImage: string;
      images: string[];
    },
  ): RoomVariantEntity {
    return {
      hotelId: data.hotelId,
      name: data.name,
      roomPrefix: data.roomPrefix,
      description: data.description,
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
      totalRooms: data.totalRooms,
      isActive: true,
    };
  }

  static toRoomVariantDetailResponseDTO(
    roomVariant: RoomVariantEntity,
    unAvailableRooms: RoomStatusEntity[],
  ): IRoomVariantDetailResponseDTO {
    return {
      id: roomVariant._id!,
      hotelId: roomVariant.hotelId,
      roomPrefix: roomVariant.roomPrefix,
      name: roomVariant.name,
      description: roomVariant.description,
      maxOccupancy: roomVariant.maxOccupancy,
      bedConfig: {
        type: roomVariant.bedConfig.type,
        count: roomVariant.bedConfig.count,
      },
      amenities: roomVariant.amenities,
      policies: {
        smokingAllowed: roomVariant.policies.smokingAllowed,
        petsAllowed: roomVariant.policies.petsAllowed,
        checkInTime: roomVariant.policies.checkInTime,
        checkOutTime: roomVariant.policies.checkOutTime,
      },
      basePrice: roomVariant.basePrice,
      coverImage: roomVariant.coverImage,
      images: roomVariant.images,
      totalRooms: roomVariant.totalRooms,
      isActive: roomVariant.isActive,
      unAvailableRooms: unAvailableRooms.map((roomStatus) => {
        return {
          roomNumber: roomStatus.roomNumber,
          status: roomStatus.status,
          reason: roomStatus.reason,
        };
      }),
    };
  }
}

import { ICreateRoomVariantRequestDTO } from "@domain/dtos/roomVariant/createRoomVariant.dto";
import { IRoomVariantDetailResponseDTO } from "@domain/dtos/roomVariant/getRoomVariantDetail.dto";
import { IRoomVariantListingResponseDTO } from "@domain/dtos/roomVariant/roomVariantListing.dto";
import { RoomVariantEntity } from "@domain/entities/roomVariant/roomVariant.entity";
import { RoomVariantStatus } from "@domain/enums/roomVariantStatus";

export class RoomVariantMapper {
  static toRoomVariantListingResponseDTO(
    roomVariants: RoomVariantEntity[],
  ): IRoomVariantListingResponseDTO {
    return {
      roomVariants: roomVariants.map((roomVariant) => ({
        id: roomVariant._id!,
        name: roomVariant.name,
        code: roomVariant.code,
        coverImage: roomVariant.coverImage,
        basePrice: roomVariant.basePrice,
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
      status: RoomVariantStatus.ACTIVE,
    };
  }

  static toRoomVariantDetailResponseDTO(
    roomVariant: RoomVariantEntity,
  ): IRoomVariantDetailResponseDTO {
    return {
      id: roomVariant._id!,
      hotelId: roomVariant.hotelId,
      name: roomVariant.name,
      code: roomVariant.code,
      description: roomVariant.description,
      baseOccupancy: roomVariant.baseOccupancy,
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
      status: roomVariant.status,
    };
  }
}

import { ICreateDestinationRequestDTO } from "@domain/dtos/admin/createDestination.dto";
import { IFindDestinationByIdResponseDto } from "@domain/dtos/admin/findDestinationById.dto";
import { IListDestinationResponseDTO } from "@domain/dtos/admin/listDestinations.dto";
import { IGetDestinationResponseDTO } from "@domain/dtos/destination/getDestination.dto";
import { DestinationEntity } from "@domain/entities/destination/destination";

export class DestinationMapper {
  static toEntityFromCreateDestinationDTO(
    data: Omit<ICreateDestinationRequestDTO, "images" | "coverImage"> & {
      images: string[];
      coverImage: string;
    },
  ): DestinationEntity {
    return {
      name: data.name,
      tagline: data.tagline,
      description: data.description,
      coverImage: data.coverImage,
      images: data.images,

      country: data.country,
      city: data.city,
      pincode: data.pincode,
      coordinates: data.coordinates,

      type: data.type,
      activities: data.activities,
      bestTimeToVisit: data.bestTimeToVisit,

      isWheelChairAccessible: data.isWheelChairAccessible,
      isFree: data.isFree,
      isAlwaysOpen: data.isAlwaysOpen,
      isActive: true,

      entryFee: data.entryFee,

      openingTime: data.openingTime,
      closingTime: data.closingTime,
      closedDays: data.closedDays,
    };
  }

  static toListDestinationResponseDTOfromEntity(
    entities: DestinationEntity[],
    pageNo: number,
    totalPages: number,
    totalDestinations: number,
  ): IListDestinationResponseDTO {
    const dto: IListDestinationResponseDTO = {
      pageNo,
      totalPages,
      totalDestinations,
      destinations: entities.map((entity) => {
        return {
          id: entity._id!,
          name: entity.name,
          tagline: entity.tagline,
          description: entity.description,
          coverImage: entity.coverImage,

          type: entity.type,
          isFree: entity.isFree,
          isActive: entity.isActive,

          entryFee: entity.entryFee,
        };
      }),
    };

    return dto;
  }

  static toFindDestinationByIdResponseDTOfromEntity(
    entity: DestinationEntity,
  ): IFindDestinationByIdResponseDto {
    return {
      id: entity._id!,
      name: entity.name,
      tagline: entity.tagline,
      description: entity.description,
      coverImage: entity.coverImage,
      images: entity.images,

      country: entity.country,
      city: entity.city,
      pincode: entity.pincode,
      coordinates: entity.coordinates,

      type: entity.type,
      activities: entity.activities,
      bestTimeToVisit: entity.bestTimeToVisit,

      isWheelChairAccessible: entity.isWheelChairAccessible,
      isFree: entity.isFree,
      isAlwaysOpen: entity.isAlwaysOpen,
      isActive: entity.isActive,

      entryFee: entity.entryFee,

      openingTime: entity.openingTime,
      closingTime: entity.closingTime,
      closedDays: entity.closedDays,
    };
  }

  static toGetDestinationResponseDTOfromEntity(
    entities: DestinationEntity[],
    pageCount: number,
  ): IGetDestinationResponseDTO {
    return {
      page: pageCount,
      destinations: entities.map((entity) => {
        return {
          id: entity._id!,
          name: entity.name,
          tagline: entity.tagline,
          description: entity.description,
          coverImage: entity.coverImage,
          images: entity.images,

          country: entity.country,
          city: entity.city,
          pincode: entity.pincode,
          coordinates: entity.coordinates,

          type: entity.type,
          activities: entity.activities,
          bestTimeToVisit: entity.bestTimeToVisit,

          isWheelChairAccessible: entity.isWheelChairAccessible,
          isFree: entity.isFree,
          isAlwaysOpen: entity.isAlwaysOpen,
          isActive: entity.isActive,

          entryFee: entity.entryFee,

          openingTime: entity.openingTime,
          closingTime: entity.closingTime,
          closedDays: entity.closedDays,
        };
      }),
    };
  }
}

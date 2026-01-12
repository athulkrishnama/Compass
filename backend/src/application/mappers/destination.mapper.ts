import { ICreateDestinationRequestDTO } from "@domain/dtos/admin/createDestination.dto";
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
      state: data.state,
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
      currency: data.currency,

      openingTime: data.openingTime,
      closingTime: data.closingTime,
      closedDays: data.closedDays,
    };
  }
}

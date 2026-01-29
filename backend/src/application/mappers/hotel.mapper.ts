import { IHotelListingResponseDTO } from "@domain/dtos/admin/hotelListing.dto";
import { ICreateHotelRequestDTO } from "@domain/dtos/hotel/createHotel.dto";
import { IGetHotelByIdResponseDTO } from "@domain/dtos/hotel/getHotelById.dto";
import {
  IHotelSearchResponseDTO,
  IHotelWithAggregatedRoomVariantDTO,
} from "@domain/dtos/hotel/hotelSearch.dto";
import { HotelEntity } from "@domain/entities/hotel/hotel.entity";

export class HotelMapper {
  static toEntityFromCreateHotelDTO(
    data: Omit<ICreateHotelRequestDTO, "coverImage" | "images"> & {
      coverImage: string;
      images: string[];
    },
  ): HotelEntity {
    return {
      userId: data.userId,
      name: data.name,
      description: data.description,
      coverImage: data.coverImage,
      images: data.images,
      address: {
        country: data.country,
        city: data.city,
        landMark: data.landMark,
        pinCode: data.pinCode,
        coordinates: data.coordinates,
      },
    };
  }

  static toHotelListingResponseDTOFromEntity(
    hotels: HotelEntity[],
    count: number,
  ): IHotelListingResponseDTO {
    return {
      hotels: hotels.map((hotel) => ({
        id: hotel._id!,
        name: hotel.name,
        description: hotel.description,
        city: hotel.address.city,
        country: hotel.address.country,
        coverImage: hotel.coverImage,
      })),
      count,
    };
  }

  static toGetHotelByIdResponseDTOfromEntity(
    entity: HotelEntity,
  ): IGetHotelByIdResponseDTO {
    return {
      id: entity._id!,
      name: entity.name,
      description: entity.description,
      coverImage: entity.coverImage,
      images: entity.images,
      country: entity.address.country,
      city: entity.address.city,
      landMark: entity.address.landMark,
      pinCode: entity.address.pinCode,
      coordinates: entity.address.coordinates,
    };
  }

  static toHotelSearchResponseDTOFromIHotelWithAggregatedRoomVariantDTO(
    data: IHotelWithAggregatedRoomVariantDTO,
    pageNo: number,
  ): IHotelSearchResponseDTO {
    const hotels = data.hotels.map((h) => {
      return {
        name: h.name,
        description: h.description,
        coverImage: h.coverImage,
        city: h.address.city,
        roomVariants: h.roomVariants.map((rv) => {
          return {
            name: rv.name,
            price: rv.basePrice,
            maxOccupancy: rv.maxOccupancy,
            coverImage: rv.coverImage,
          };
        }),
      };
    });
    return { hotels, pageNo };
  }
}

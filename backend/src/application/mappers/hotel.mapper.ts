import { IHotelListingResponseDTO } from "@domain/dtos/admin/hotelListing.dto";
import { ICreateHotelRequestDTO } from "@domain/dtos/hotel/createHotel.dto";
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
}

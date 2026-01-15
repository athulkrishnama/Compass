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
}

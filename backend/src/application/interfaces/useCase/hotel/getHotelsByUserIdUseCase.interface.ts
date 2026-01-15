import { IHotelListingResponseDTO } from "@domain/dtos/admin/hotelListing.dto";

export interface IGetHotelsByUserIdUseCase {
  execute(userId: string): Promise<IHotelListingResponseDTO>;
}

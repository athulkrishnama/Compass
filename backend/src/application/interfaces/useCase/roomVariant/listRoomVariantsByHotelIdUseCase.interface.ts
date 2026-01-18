import { IRoomVariantListingResponseDTO } from "@domain/dtos/roomVariant/roomVariantListing.dto";

export interface IListRoomVariantsByHotelIdUseCase {
  execute(hotelId: string): Promise<IRoomVariantListingResponseDTO>;
}

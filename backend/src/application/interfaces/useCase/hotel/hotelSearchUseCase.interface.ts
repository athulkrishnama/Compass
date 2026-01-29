import {
  IHotelSearchRequestDTO,
  IHotelSearchResponseDTO,
} from "@domain/dtos/hotel/hotelSearch.dto";

export interface IHotelSearchUseCase {
  search(dto: IHotelSearchRequestDTO): Promise<IHotelSearchResponseDTO>;
}

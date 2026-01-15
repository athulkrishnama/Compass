import { IGetHotelByIdResponseDTO } from "@domain/dtos/hotel/getHotelById.dto";

export interface IGetHotelByIdUseCase {
  execute(id: string): Promise<IGetHotelByIdResponseDTO>;
}

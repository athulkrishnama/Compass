import { IEditHotelRequestDTO } from "@domain/dtos/hotel/editHotel.dto";

export interface IEditHotelUseCase {
  execute(dto: IEditHotelRequestDTO): Promise<void>;
}

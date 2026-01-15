import { ICreateHotelRequestDTO } from "@domain/dtos/hotel/createHotel.dto";

export interface ICreateHotelUseCase {
  execute(data: ICreateHotelRequestDTO): Promise<void>;
}

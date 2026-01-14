import { ICreateHotelRequestDTO } from "@domain/dtos/hotel/createHotel.dto";

export interface ICreateUserUseCase {
  execute(data: ICreateHotelRequestDTO): Promise<void>;
}

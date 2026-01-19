import { ICreateRoomRequestDTO } from "@domain/dtos/room/createRoomDTO";

export interface ICreateRoomUseCase {
  execute(data: ICreateRoomRequestDTO): Promise<void>;
}

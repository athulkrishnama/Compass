import { ICreateRoomRequestDTO } from "@domain/dtos/room/createRoom.dto";

export interface ICreateRoomUseCase {
  execute(data: ICreateRoomRequestDTO): Promise<void>;
}

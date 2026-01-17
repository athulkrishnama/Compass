import { IEditRoomRequestDTO } from "@domain/dtos/room/editRoom.dto";

export interface IEditRoomUseCase {
  execute(data: IEditRoomRequestDTO): Promise<void>;
}

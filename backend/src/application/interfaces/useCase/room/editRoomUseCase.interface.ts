import { IEditRoomRequestDTO } from "@domain/dtos/room/editroomDTO";

export interface IEditRoomUseCase {
  execute(data: IEditRoomRequestDTO): Promise<void>;
}

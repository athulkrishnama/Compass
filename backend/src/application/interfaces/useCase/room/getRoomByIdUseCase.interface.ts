import { IRoomDetailResponseDTO } from "@domain/dtos/room/getRoomDetail.dto";

export interface IGetRoomByIdUseCase {
  execute(roomId: string): Promise<IRoomDetailResponseDTO>;
}

import { IRestoreRoomRequestDTO } from "@domain/dtos/roomVariant/restoreRoom.dto";

export interface IRestoreRoomUseCase {
  execute(data: IRestoreRoomRequestDTO): Promise<void>;
}

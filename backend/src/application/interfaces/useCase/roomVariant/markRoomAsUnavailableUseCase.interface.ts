import { IMarkRoomAsUnavailableRequestDTO } from "@domain/dtos/roomVariant/markRoomAsUnavailable.dto";

export interface IMarkRoomAsUnavailableUseCase {
  execute(data: IMarkRoomAsUnavailableRequestDTO): Promise<string>;
}
